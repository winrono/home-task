import { ApiClient } from "integrations/portchain-api/api-client";
import { Schedule, Vessel } from "integrations/portchain-api/types";
import { vessels } from './data/vessels';
import { schedules } from './data/schedules';

export class MockApiClient implements ApiClient {
    getVessels(): Promise<Vessel[]> {
        return Promise.resolve(vessels);
    }
    getVesselSchedule(id: number): Promise<Schedule> {
        return Promise.resolve(schedules.find(s => s.vessel.imo === id)) as Promise<Schedule>;
    }
}