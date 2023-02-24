const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 800;

const image = new Image();
image.src = "img/123.png";

console.log(1);
image.onload = () => {
  animate();
};

const placementTilesData2D = [];
for (let i = 0; i < placementTilesData.length; i += 40) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 40));
}

//изменяемые переменные
const enemy_spawn_rate = 1;
const enemy_speed = 2;
const projectile_speed = 4;
const damage = 7;
const tower_range = 250;
let lives = 12;
let enemyCont = 3;
const add_enemy = 2;
const last_levl = 10;
const taver_cost = 75;
const next_taver_cost = 25;
const add_enemy_health = 10;

let levl = 0;
const document_lives = document.getElementById("lives");
const monye = document.getElementById("monye");
let monye_counter = 0;

const placementTiles = []; //башни
placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 160) {
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 32,
            y: y * 32,
          },
        })
      );
    }
  });
});

const enemys = []; //враги

const spawnEnemies = (spawnCount = 3) => {
  levl += 1;

  for (let i = 0; i < spawnCount; i++) {
    setTimeout(() => {
      enemys.push(
        new Enemy({
          position: { x: waypoints[0].x, y: waypoints[0].y },
          enemy_speed: enemy_speed,
          levl: levl,
          add_enemy_health: add_enemy_health,
        })
      );
    }, i * enemy_spawn_rate * 1000);
  }
};

const bildings = [];
let activeTile = undefined;

let timers = [];
const startTime = new Date();

spawnEnemies(enemyCont);
const animate = () => {
  monye_counter++;
  if (monye_counter % 100 === 0) {
    monye.innerText = parseInt(monye.textContent) + 1;
  }

  const timer = requestAnimationFrame(animate);

  timers.push(timer);
  if ((timers.length = 2)) {
    cancelAnimationFrame(timer[0]);
    timers.shift();
  }

  if (levl === last_levl) {
    cancelAnimationFrame(timer);
    document.getElementById("You_won").style.display = "flex";
  }

  c.drawImage(image, 0, 0);

  for (let i = enemys.length - 1; i >= 0; i--) {
    //по чему идем с конца
    const enemy = enemys[i];
    enemy.updete();

    if (
      Math.abs(
        Math.round(waypoints[waypoints.length - 1].y) -
          Math.round(enemy.position.y)
      ) < Math.abs(enemy.velocity.y * enemy_speed) &&
      Math.abs(
        Math.round(waypoints[waypoints.length - 1].x) -
          Math.round(enemy.position.x)
      ) < Math.abs(enemy.velocity.x * enemy_speed)
    ) {
      enemys.splice(i, 1);
      lives--;
      document_lives.innerText = lives;
      if (lives === 0) {
        cancelAnimationFrame(timer);
        document.getElementById("game_over").style.display = "flex";
      }
    }
    if (enemys.length <= 0) {
      enemyCont += add_enemy;
      spawnEnemies(enemyCont);
    }
  }
  placementTiles.forEach((tile) => {
    tile.updete(mase);
  });
  bildings.forEach((bilding) => {
    bilding.updete();
    bilding.target = null;
    const validEnemies = enemys.filter((enemy) => {
      const xDefference = enemy.position.x - enemy.radius - bilding.position.x;
      const yDefference = enemy.position.y - enemy.radius - bilding.position.y;
      const distance = Math.hypot(xDefference, yDefference);
      return distance < enemy.radius + bilding.tower_range;
    });

    bilding.target = validEnemies[0];

    for (let i = bilding.projectiles.length - 1; i >= 0; i--) {
      const projectile = bilding.projectiles[i];
      projectile.updete();
      const xDefference = projectile.enemy.position.x - projectile.position.x;
      const yDefference = projectile.enemy.position.y - projectile.position.y;
      const distance = Math.hypot(xDefference, yDefference);

      //this is when a projectile hits an enemy
      if (distance < projectile.enemy.radius + projectile.radius) {
        projectile.enemy.health -= bilding.bilding_level * damage;

        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemys.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });
          if (enemyIndex > -1) {
            enemys.splice(enemyIndex, 1);
          }
        }
        if (enemys.length <= 0) {
          enemyCont += 3;
          spawnEnemies(enemyCont);
        }

        bilding.projectiles.splice(i, 1);
        monye.innerText = parseInt(monye.textContent) + 3;
      }
    }
  });
};
const mase = {
  x: undefined,
  y: undefined,
};
let bilding_level = 1;
let crossbow_src = "img/Towe1/crossbow/Tower 06 - Level 01 - Weapon.png";
canvas.addEventListener("click", (e) => {
  if (activeTile && !activeTile.isOccupied && monye.textContent >= taver_cost) {
    bildings.push(
      new Bilding({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y,
        },
        tower_range: tower_range,
        bilding_level: bilding_level,
        crossbow_src: crossbow_src,
      })
    );
    activeTile.isOccupied = true;
    monye.innerText = parseInt(monye.textContent) - taver_cost;
  }
});

canvas.addEventListener("dblclick", (e) => {
  for (let i = 0; i < bildings.length; i++) {
    const bilding = bildings[i];
    if (
      bilding.position.x === activeTile.position.x &&
      bilding.position.y === activeTile.position.y
    ) {
      if (bildings[i].bilding_level < 3) {
        let t = bildings[i].bilding_level;

        if (
          monye.textContent >=
          taver_cost + next_taver_cost * bildings[i].bilding_level
        ) {
          t += 1;

          bildings.splice(i, 1);
          switch (t) {
            case 2:
              bildings.push(
                new Bilding({
                  position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y,
                  },
                  tower_range: tower_range,
                  bilding_level: t,
                  crossbow_src:
                    "img/Towe1/crossbow/Tower 06 - Level 02 - Weapon.png",
                })
              );
              monye.innerText = parseInt(monye.textContent) - 100;

              break;
            case 3:
              bildings.push(
                new Bilding({
                  position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y,
                  },
                  tower_range: tower_range,
                  bilding_level: t,
                  crossbow_src:
                    "img/Towe1/crossbow/Tower 06 - Level 03 - Weapon.png",
                })
              );
              monye.innerText = parseInt(monye.textContent) - 125;
          }
        }
      }

      break;
    }
  }
});

window.addEventListener("mousemove", (e) => {
  mase.x = e.pageX;
  mase.y = e.pageY;

  activeTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mase.x > tile.position.x &&
      mase.x < tile.position.x + tile.size * 2 &&
      mase.y > tile.position.y - tile.size &&
      mase.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
});
// window.addEventListener("", requestAnimationFrame(animate));
// const start = () => {
//   animate();
// };
