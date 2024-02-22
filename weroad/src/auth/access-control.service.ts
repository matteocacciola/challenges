import { Injectable } from '@nestjs/common';
import { Role as RoleEntity } from '../roles/roles.entity';
import { Role } from '../roles/roles.enums';
import { uniqueArray } from '../app.helpers';

interface IsAuthorizedParams {
  currentRoles: RoleEntity[];
  requiredRole: Role;
}

@Injectable()
export class AccessControlService {
  private hierarchies: Array<Map<string, number>> = [];
  private priority = 1;

  constructor() {
    this.buildRoles([Role.GUEST, Role.EDITOR, Role.ADMIN]);
    this.buildRoles([Role.EDITOR, Role.ADMIN]);
  }

  private buildRoles(roles: Role[]) {
    const hierarchy: Map<string, number> = new Map();
    roles.forEach((role) => {
      hierarchy.set(role, this.priority);
      this.priority++;
    });
    this.hierarchies.push(hierarchy);
  }

  public isAuthorized({ currentRoles, requiredRole }: IsAuthorizedParams) {
    for (const hierarchy of this.hierarchies) {
      const currentRole = currentRoles.find((role) => hierarchy.has(role.name));
      if (
        currentRole &&
        this.verifyRole(hierarchy, currentRole, requiredRole)
      ) {
        return true;
      }
    }
    return false;
  }

  private verifyRole(
    hierarchy: Map<string, number>,
    currentRole: RoleEntity,
    requiredRole: Role,
  ) {
    const priority = hierarchy.get(currentRole.name);
    const requiredPriority = hierarchy.get(requiredRole);
    return priority && requiredPriority && priority >= requiredPriority;
  }

  public getHierarchy(userRoles: RoleEntity[]): string[] {
    const result = this.hierarchies.reduce((acc, hierarchy) => {
      const currentRole = userRoles.find((role) => hierarchy.has(role.name));
      const priority = hierarchy.get(currentRole?.name);
      if (!priority) {
        return acc;
      }
      acc.push(
        ...Array.from(hierarchy.entries())
          .filter(([, p]) => priority >= p)
          .map(([role]) => role),
      );
      return acc;
    }, []);

    return uniqueArray<string>(result);
  }
}
