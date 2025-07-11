import { Get, RestController } from '@Digital Uprisers/decorators';

import { RoleService } from '@/services/role.service';

@RestController('/roles')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get('/')
	getAllRoles() {
		return this.roleService.getAllRoles();
	}
}
