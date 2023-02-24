class Sprite {
  constructor({ position = { x: 0, y: 0 }, src, frames = { max: 1 } }) {
    this.position = position;
    this.imagee = new Image();
    this.imagee.src = src;
    this.frames = {
      max: frames.max,
      current: 0,
      elapsed: 0,
      hold: 10,
    };
  }
  draw(
    angle = 0,
    position_y = 0,
    position_x = 0,
    tower_center_y = 0,
    tower_center_x = 0
  ) {
    const cropWidth = this.imagee.width / this.frames.max;
    const crop = {
      position: {
        x: cropWidth * this.frames.current,
        y: 0,
      },
      width: cropWidth,
      height: this.imagee.height,
    };

    c.save();
    if (position_x != 0 && position_y != 0) {
      c.translate(position_x, position_y);
      c.rotate(angle + 1.570796);
      c.translate(-position_x, -position_y);
    }

    c.drawImage(
      this.imagee,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      this.position.x + tower_center_x - crop.width / 2,
      this.position.y - tower_center_y - crop.height / 2,
      crop.width,
      crop.height
    );
    c.restore();
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold === 0) {
      this.frames.current++;
      if (this.frames.current >= this.frames.max - 1) {
        this.frames.current = 0;
      }
    }
  }
}
