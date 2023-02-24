class Enemy extends Sprite {
  constructor({
    position = { x: 0, y: 0 },
    enemy_speed = 1,
    levl,
    add_enemy_health,
  }) {
    super({
      position,
      src: "img/enemy/enemy.png",
      frames: { max: 8 },
    });

    this.waypointIndex = 0;
    this.radius = 20;
    this.health = 90 + levl * add_enemy_health;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy_speed = enemy_speed;
  }
  draw() {
    super.draw();
    c.fillStyle = "rgba(0,0,255,0.1)";
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fill();

    c.beginPath();

    c.fillStyle = "red";
    c.fillRect(
      this.position.x - this.radius,
      this.position.y - this.radius - 15,
      this.radius * 2,
      10
    );
    c.fillStyle = "green";
    c.fillRect(
      this.position.x - this.radius,
      this.position.y - this.radius - 15,
      (this.radius * 2 * this.health) / 100,
      10
    );
  }
  updete() {
    const waypoint = waypoints[this.waypointIndex];
    this.draw();
    const yDistance = waypoint.y - this.position.y;
    const xDistance = waypoint.x - this.position.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.velocity.x = Math.cos(angle);
    this.velocity.y = Math.sin(angle);

    this.position.y += this.velocity.y * this.enemy_speed;
    this.position.x += this.velocity.x * this.enemy_speed;

    if (
      Math.abs(Math.round(waypoint.y) - Math.round(this.position.y)) <
        Math.abs(this.velocity.y * this.enemy_speed) &&
      Math.abs(Math.round(waypoint.x) - Math.round(this.position.x)) <
        Math.abs(this.velocity.x * this.enemy_speed) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex += 1;
    }
  }
}
