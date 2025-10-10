import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';
import {Schedule} from '../../domain/model/schedule.entity';
import {ScheduleResource, SchedulesResponse} from '../response/schedule-response';


/**
 * Assembler for converting between Schedule entities, ScheduleResource resources, and SchedulesResponse.
 */
export class ScheduleAssembler implements BaseAssembler<Schedule, ScheduleResource, SchedulesResponse> {

  toEntitiesFromResponse(response: SchedulesResponse): Schedule[] {
    return response.schedules.map(resource => this.toEntityFromResource(resource as ScheduleResource));
  }

  toEntityFromResource(resource: ScheduleResource): Schedule {
    return new Schedule({
      id: resource.id,
      doctorId: resource.doctorId,
      dayOfWeek: resource.dayOfWeek,
      startTime: resource.startTime,
      endTime: resource.endTime,
      isAvailable: resource.isAvailable
    });
  }

  toResourceFromEntity(entity: Schedule): ScheduleResource {
    return {
      id: entity.id,
      doctorId: entity.doctorId,
      dayOfWeek: entity.dayOfWeek,
      startTime: entity.startTime,
      endTime: entity.endTime,
      isAvailable: entity.isAvailable
    } as ScheduleResource;
  }
}
