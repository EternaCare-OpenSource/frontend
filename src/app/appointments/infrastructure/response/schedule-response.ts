import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents the API resource/DTO for a schedule.
 */
export interface ScheduleResource extends BaseResource {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

/**
 * Represents the API response structure for a list of schedules.
 */
export interface SchedulesResponse extends BaseResponse {
  schedules: ScheduleResource[];
}
