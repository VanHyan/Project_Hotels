import {
  Users, Hotels, HotelRooms, Photo, Booking, MapArmenia,
} from '../models';

async function main() {
  try {
    for (const Model of [
      MapArmenia,
      Users,
      Hotels,
      HotelRooms,
      Booking,
      Photo,
    ]) {
      await Model.sync({ alter: true });
    }
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
}

main();
