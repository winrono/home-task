type LogEntry = {
    updatedField: string;
    arrival: string;
    departure: string;
    isOmitted: boolean;
    createdDate: string;
};

type Port = {
    id: string;
    name: string;
};

export type Vessel = {
    imo: number;
    name: string;
}

export type PortCall = {
    arrival: string;
    departure: string;
    createdDate: string;
    isOmitted: boolean;
    service: string;
    port: Port;
    logEntries: LogEntry[];
};

export type Schedule = {
    vessel: Vessel,
    portCalls: PortCall[];
};

export type PortCallSummary = {
    arrival: string;
    departure: string;
    port: Port;
}