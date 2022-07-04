import { SetMetadata } from "@nestjs/common";

export const Verified = (verified: boolean = true) => SetMetadata('verified', verified);