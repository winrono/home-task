import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Schedule, Vessel } from "./types";
import { PORTCHAIN_BASE_URL } from "./constants";
import { ApiClient } from "./api-client";

export class PortchainApiClient implements ApiClient {
    private httpClient : AxiosInstance;

    constructor() {
        this.httpClient = axios.create({
            baseURL: PORTCHAIN_BASE_URL,
        })
    }

    async getVessels() {
        const response: AxiosResponse<Vessel[]> = await this.httpClient.get('/vessels');
        return response.data;
    }

    async getVesselSchedule(id: number) {
        const response: AxiosResponse<Schedule> = await this.httpClient.get(`/schedule/${id}`);
        return response.data;
    }
}