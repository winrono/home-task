import { z } from 'zod';
import * as schemas from './schemas';

export type Port = z.infer<typeof schemas.PortSchema>;
export type Vessel = z.infer<typeof schemas.VesselSchema>;
export type PortCall = z.infer<typeof schemas.PortCallSchema>;
export type Schedule = z.infer<typeof schemas.ScheduleSchema>;
export type PortCallSummary = z.infer<typeof schemas.PortCallSummarySchema>;