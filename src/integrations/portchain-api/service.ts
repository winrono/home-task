import { ApiClient } from "./api-client";
import { ScheduleArraySchema, VesselArraySchema } from "./schemas";
import { PortCallSummary } from "./types";

export class PortchainService {
    private apiClient: ApiClient;
    private portFrequencies: { portId: string, portName: string, frequency: number }[] = [];
    private portToDurationsAndName: { [portId: string]: { durations: number[]; portName: string } } = {};

    private constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    static async create(apiClient: ApiClient): Promise<PortchainService> {
        const service = new PortchainService(apiClient);
        await service.prepareCalculationData();
        return service;
    }

    getTopPorts(count: number) {
        return this.portFrequencies.slice(0, count);
    }

    getBottomPorts(count: number) {
        return this.portFrequencies.slice(-count).reverse();
    }

    getPortCallDurationPercentiles(percentile: number) {
        const portPercentiles: { portId: string, portName: string, percentile: number }[] = [];

        for (const portId in this.portToDurationsAndName) {
            const { durations, portName } = this.portToDurationsAndName[portId];
            const portPercentile = this.calculatePercentile(durations, percentile);

            portPercentiles.push({
                portId,
                portName,
                percentile: portPercentile
            });
        }

        return portPercentiles;
    }

    private async prepareCalculationData() {
        const vessels = await this.apiClient.getVessels();

        const validatedVessels = VesselArraySchema.parse(vessels);

        const vesselIds = validatedVessels.map(v => v.imo);

        const schedulePromises = vesselIds.map(vesselId => {
            return this.apiClient.getVesselSchedule(vesselId);
        });
        const vesselSchedules = await Promise.all(schedulePromises);

        const validatedVesselSchedules = ScheduleArraySchema.parse(vesselSchedules);

        const summaries = validatedVesselSchedules.map(schedule => {
            return schedule.portCalls
                .filter(p => !p.isOmitted)
                .map(({ arrival, departure, port }) => ({ arrival, departure, port }))
        }).flat();

        this.portFrequencies = this.calculatePortFrequencies(summaries);
        this.portToDurationsAndName = this.calculatePortDurationsAndNames(summaries);
    }

    private calculatePortFrequencies(summaries: PortCallSummary[]) {
        const portFrequencies: { [portId: string]: { frequency: number; portName: string } } =
            summaries.reduce(
                (acc, summary) => {
                    const { id, name } = summary.port;
                    if (!acc[id]) {
                        acc[id] = { frequency: 0, portName: name };
                    }
                    acc[id].frequency++;
                    return acc;
                },
                {} as { [portId: string]: { frequency: number; portName: string } }
            );

        const portFrequenciesArray = Object.entries(portFrequencies).map(
            ([portId, { frequency, portName }]) => ({ portId, frequency, portName })
        );

        portFrequenciesArray.sort((a, b) => b.frequency - a.frequency);

        return portFrequenciesArray;
    }

    private calculatePortDurationsAndNames(summaries: PortCallSummary[]) {
        const portToDurationsAndNames: { [portId: string]: { durations: number[]; portName: string } } = {};

        for (const summary of summaries) {
            const { port, arrival, departure } = summary;

            const arrivalTimestamp = new Date(arrival).getTime();
            const departureTimestamp = new Date(departure).getTime();
            const duration = departureTimestamp - arrivalTimestamp;

            if (!portToDurationsAndNames[port.id]) {
                portToDurationsAndNames[port.id] = { durations: [], portName: port.name };
            }

            portToDurationsAndNames[port.id].durations.push(duration);
        }

        for (const portId in portToDurationsAndNames) {
            portToDurationsAndNames[portId].durations.sort((a, b) => a - b);
        }

        return portToDurationsAndNames;
    }

    // Calculation logic is basically the same as, for example, in library https://www.npmjs.com/package/percentile
    // reference to the implementation: https://github.com/d4rkr00t/percentile/blob/master/lib/index.js#L68
    private calculatePercentile(values: number[], percentile: number): number {
        const index = Math.ceil(values.length * (percentile / 100)) - 1;
        return values[index];
    }
}