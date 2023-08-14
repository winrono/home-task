import { PortchainService } from "integrations/portchain-api";
import { ApiClient } from "integrations/portchain-api/api-client";
import { ZodError } from "zod";
import { MockApiClient } from "./mocks/mock-api-client";
import { topPorts } from "./mocks/expected-calculations/top-ports";
import { bottomPorts } from "./mocks/expected-calculations/bottom-ports";
import { percentile5th } from "./mocks/expected-calculations/percentile5th";
import { percentile20th } from "./mocks/expected-calculations/percentile20th";

describe('PortchainService', () => {

    describe('service creation', () => {
        test('should be created if api returns empty dataset', async () => {
            const mockApiClient = {
                getVessels: jest.fn(() => Promise.resolve([])),
                getVesselSchedule: jest.fn(() => Promise.resolve({})),
            };

            await PortchainService.create(mockApiClient as unknown as ApiClient);
        });

        test('should be created if api returns valid response', async () => {
            const mockApiClient = {
                getVessels: jest.fn(() => Promise.resolve([
                    {
                        name: 'test',
                        imo: 1,
                    },
                    {
                        name: 'test2',
                        imo: 2,
                    }
                ])),
                getVesselSchedule: jest.fn(() => Promise.resolve({
                    vessel: {
                        name: 'test',
                        imo: 1,
                    },
                    portCalls: [
                        {
                            arrival: "2018-12-30T08:00:00+00:00",
                            departure: "2018-12-31T03:00:00+00:00",
                            createdDate: "2018-11-15T14:58:44.813629+00:00",
                            isOmitted: true,
                            service: "East Coast Loop 4",
                            port: {
                                id: "HKHKG",
                                name: "Hong Kong"
                            },
                        }
                    ]
                })),
            };

            await PortchainService.create(mockApiClient as unknown as ApiClient);
        });

        test('should throw validation error if getVessels endpoint returns data without imo property', async () => {
            const mockApiClient = {
                getVessels: jest.fn(() => Promise.resolve([
                    {
                        name: 'test'
                    },
                    {
                        name: 'test2'
                    }
                ])),
                getVesselSchedule: jest.fn(() => Promise.resolve({})),
            };

            try {
                await PortchainService.create(mockApiClient as unknown as ApiClient);
            } catch (error) {
                if (error instanceof ZodError) {
                    expect(error.name).toEqual('ZodError');
                } else {
                    throw error;
                }
            }
        });

        test('should throw validation error if getVesselSchedule endpoint returns empty object', async () => {
            const mockApiClient = {
                getVessels: jest.fn(() => Promise.resolve([
                    {
                        name: 'test',
                        imo: 1,
                    },
                    {
                        name: 'test2',
                        imo: 2,
                    }
                ])),
                getVesselSchedule: jest.fn(() => Promise.resolve({})),
            };

            try {
                await PortchainService.create(mockApiClient as unknown as ApiClient);
            } catch (error) {
                if (error instanceof ZodError) {
                    expect(error.name).toEqual('ZodError');
                } else {
                    throw error;
                }
            }
        });

        test('should throw validation error if getVesselSchedule endpoint returns portCall without arrival time', async () => {
            const mockApiClient = {
                getVessels: jest.fn(() => Promise.resolve([
                    {
                        name: 'test',
                        imo: 1,
                    },
                    {
                        name: 'test2',
                        imo: 2,
                    }
                ])),
                getVesselSchedule: jest.fn(() => Promise.resolve({
                    vessel: {
                        name: 'test',
                        imo: 1,
                    },
                    portCalls: [
                        {
                            departure: "2018-12-31T03:00:00+00:00",
                            createdDate: "2018-11-15T14:58:44.813629+00:00",
                            isOmitted: true,
                            service: "East Coast Loop 4",
                            port: {
                                id: "HKHKG",
                                name: "Hong Kong"
                            },
                        }
                    ]
                })),
            };

            try {
                await PortchainService.create(mockApiClient as unknown as ApiClient);
            } catch (error) {
                if (error instanceof ZodError) {
                    expect(error.name).toEqual('ZodError');
                } else {
                    throw error;
                }
            }
        });
    });

    describe('service data handling', () => {
        let service: PortchainService;

        beforeEach(async () => {

            service = await PortchainService.create(new MockApiClient())
        })

        test('should return 5 top ports', () => {
            const ports = service.getTopPorts(5);

            expect(ports).toMatchObject(topPorts);
        });

        test('should return 3 top ports', () => {
            const ports = service.getTopPorts(3);

            expect(ports).toMatchObject(topPorts.slice(0, 3));
        });

        test('should return 1 top port', () => {
            const ports = service.getTopPorts(1);

            expect(ports).toMatchObject(topPorts.slice(0, 1));
        });

        test('should return 5 bottom ports', () => {
            const ports = service.getBottomPorts(5);

            expect(ports).toMatchObject(bottomPorts);
        });

        test('should return 3 bottom ports', () => {
            const ports = service.getBottomPorts(3);

            expect(ports).toMatchObject(bottomPorts.slice(0, 3));
        });

        test('should return 1 bottom port', () => {
            const ports = service.getBottomPorts(1);

            expect(ports).toMatchObject(bottomPorts.slice(0, 1));
        });

        test('should correctly calculate 5th percentile', () => {
            const percentiles = service.getPortCallDurationPercentiles(5);

            expect(percentiles).toMatchObject(percentile5th);
        });

        test('should correctly calculate 20th percentile', () => {
            const percentiles = service.getPortCallDurationPercentiles(20);

            expect(percentiles).toMatchObject(percentile20th);
        });
    });
});