class Projectile extends Sprite {
  constructor({
    position = {
      x: 0,
      y: 0,
    },
    enemy,
    projectile_speed,
    projectile_level,
    max,
    bilding_level,
  }) {
    super({
      position,
      src: projectile_level,
      frames: { max },
    });
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.enemy = enemy;
    this.radius = 15;
    this.projectile_speed = projectile_speed;
    this.bilding_level = bilding_level;
  }

  updete() {
    const angle = Math.atan2(
      this.enemy.position.y - this.position.y,
      this.enemy.position.x - this.position.x
    );

    this.velocity.x = Math.cos(angle) * this.projectile_speed;
    this.velocity.y = Math.sin(angle) * this.projectile_speed;

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    this.draw(angle, this.position.y, this.position.x, 0);
  }
}
