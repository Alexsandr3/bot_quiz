import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

//checking id from uri params
@Injectable()
export class ValidateUuidPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isUUID(value)) {
      throw new NotFoundException(`Incorrect id,  please enter a valid one`);
    }
    return value;
  }
}

@Injectable()
export class ValidateUuidPipeFor404Error implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isUUID(value)) {
      throw new BadRequestException(`Incorrect id,  please enter a valid one`);
    }
    return value;
  }
}
