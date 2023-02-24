class Bilding extends Sprite {
  constructor({
    position = { x: 0, y: 0 },
    tower_range,
    bilding_level,
    crossbow_src,
  }) {
    super({
      position,
      src: crossbow_src,
      frames: { max: 6 },
    });
    this.position = position;
    this.center = {
      x: this.position.x + 32,
      y: this.position.y - 64,
    };
    this.image = new Image();
    this.image.src = "img/Towe1/Tower 06.png";
    this.projectiles = [];
    this.bilding_level = bilding_level;
    this.elapseSpawn = 0;
    this.tower_range = tower_range;
    this.crossbow_src = crossbow_src;
  }
  draw() {
    c.drawImage(
      this.image,
      0 + 64 * (this.bilding_level - 1),
      0,
      64,
      128,
      this.position.x,
      this.position.y - 96,
      64,
      128
    );
    if (this.target != undefined) {
      let tower_center_y = 0;
      let tower_center_x = 0;
      switch (this.bilding_level) {
        case 1:
          tower_center_y = 48;
          tower_center_x = 32;

          break;
        case 2:
          tower_center_y = 54;
          tower_center_x = 32;
          break;
        case 3:
          tower_center_y = 60;
          tower_center_x = 32;
          break;
      }
      super.draw(
        Math.atan2(
          this.target.position.y - this.position.y,
          this.target.position.x - this.position.x
        ),
        this.position.y - tower_center_y,
        this.position.x + tower_center_x,
        tower_center_y,
        tower_center_x
      );
    }
    c.beginPath();
    c.arc(
      this.position.x + 32,
      this.position.y,
      this.tower_range,
      0,
      Math.PI * 2
    );
    c.fillStyle = "rgba(0,0,255,0.09)";
    c.fill();
  }
  updete() {
    this.draw();
    let projectile_level = null;
    let max = null;
    if (this.elapseSpawn % 50 === 0 && this.target) {
      switch (this.bilding_level) {
        case 1:
          projectile_level =
            "img/Towe1/Projectile/Tower 06 - Level 01 - Projectile.png";
          max = 3;
          break;
        case 2:
          projectile_level =
            "img/Towe1/Projectile/Tower 06 - Level 02 - Projectile.png";
          max = 4;
          break;
        case 3:
          projectile_level =
            "img/Towe1/Projectile/Tower 06 - Level 03 - Projectile.png";
          max = 4;
          break;
      }

      this.projectiles.push(
        new Projectile({
          position: {
            x: this.center.x,
            y: this.center.y + 16,
          },
          enemy: this.target,
          projectile_speed: projectile_speed,
          projectile_level: projectile_level,
          max: max,
          bilding_level: this.bilding_level,
        })
      );
    }
    this.elapseSpawn++;
  }
  choose_projectile() {}
}
