import { Schedule, Vessel } from "./types";

export interface ApiClient {
    getVessels(): Promise<Vessel[]>;
    getVesselSchedule(id: number): Promise<Schedule>;
}