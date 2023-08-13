import { world, Entity, EntityHitEntityAfterEvent, EntityEquipmentInventoryComponent, EquipmentSlot, EntityHealthComponent, MolangVariableMap } from '@minecraft/server'

world.afterEvents.entityHitEntity.subscribe(onEntityHit)

function onEntityHit(event: EntityHitEntityAfterEvent) {
    const target = event.hitEntity
    const source = event.damagingEntity
    if (isHolding(source, 'foxgames:pillow')) {
        const dir = source.getViewDirection()
        target.applyKnockback(dir.x, dir.z, 3, 0.5)
        addHealth(target, 1);
        runPillowParticle(target)
    }
}

function isHolding(entity: Entity, itemId: string) {
    // entity.getComponents().forEach(c => console.warn(`component ${c.typeId}`));
    const equipmentComponent = entity.getComponent('equipment_inventory') as EntityEquipmentInventoryComponent
    const mainhand = equipmentComponent.getEquipment(EquipmentSlot.mainhand)
    return mainhand.typeId === itemId
}

function addHealth(entity: Entity, amount: number) {
    const healthComponent = entity.getComponent('health') as EntityHealthComponent
    healthComponent.setCurrentValue(healthComponent.currentValue + amount)
}

function runPillowParticle(entity: Entity) {
    const dim = world.getDimension('overworld');
    dim.spawnParticle('foxgames:pillow_feathers', entity.getHeadLocation(), new MolangVariableMap());
}