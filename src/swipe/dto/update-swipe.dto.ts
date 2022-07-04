import { PartialType } from '@nestjs/mapped-types';
import { CreateSwipeDto } from './create-swipe.dto';

export class UpdateSwipeDto extends PartialType(CreateSwipeDto) {

    isMatched?: boolean
    
}
