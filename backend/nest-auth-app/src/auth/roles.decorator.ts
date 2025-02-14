import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../shared/constants';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
