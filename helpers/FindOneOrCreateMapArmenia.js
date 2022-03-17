import Promise from 'bluebird';
import MapArmenia from '../models/MapArmenia';
import data from './mapArmenia.json';

export default async function FindOneOrCreateMapArmenia() {
  const mapData = await MapArmenia.findAll({ where: {}, raw: true });
  if (mapData.length === 0) {
    await Promise.map(Object.entries(data), async ([, d]) => {
      await MapArmenia.create({
        dataUrl: d.dataUrl,
        className: d.className,
        d: d.d,
        name: d.name,
      });
    });
  }
}
