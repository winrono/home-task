import { z } from 'zod';

export const PortSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const VesselSchema = z.object({
    imo: z.number(),
    name: z.string().optional(),
});

export const VesselArraySchema = z.array(VesselSchema);

export const PortCallSchema = z.object({
    arrival: z.string(),
    departure: z.string(),
    createdDate: z.any().optional(),
    isOmitted: z.boolean(),
    service: z.any().optional(),
    port: PortSchema,
    logEntries: z.any().optional(),
});

export const ScheduleSchema = z.object({
    vessel: VesselSchema,
    portCalls: z.array(PortCallSchema),
});

export const ScheduleArraySchema = z.array(ScheduleSchema);

export const PortCallSummarySchema = z.object({
    arrival: z.string(),
    departure: z.string(),
    port: PortSchema,
});