class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 32;
    this.color = "rgb(255,255,255,0.12)";
    this.occupied = false;
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(
      this.position.x,
      this.position.y - 32,
      this.size + 32,
      this.size + 32
    );
  }
  updete(mase) {
    if (
      mase.x > this.position.x &&
      mase.x < this.position.x + this.size * 2 &&
      mase.y > this.position.y - this.size &&
      mase.y < this.position.y + this.size
    ) {
      this.draw();
    }
  }
}
