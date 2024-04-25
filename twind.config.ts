// import colors from 'tailwindcss/colors';

// const makeTailwindColor = (color, key, colorNo = 500) => ({
//   [key]: color[colorNo],
//   [`${key}-light`]: color[colorNo - 100],
//   [`${key}-dark`]: color[colorNo + 100],
// });

import { defineConfig } from '@twind/core';
import presetTailwind from '@twind/preset-tailwind';
import presetAutoprefix from '@twind/preset-autoprefix';

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
});
// export default {
//   content: ['./src/**/*.{js,jsx,ts,tsx,html,css}'],
//   theme: {
//     // extend: {},
//     // colors: {
//     //   ...colors,
//     //   ...makeTailwindColor(colors.sky, 'primary'),
//     //   ...makeTailwindColor(colors.rose, 'danger'),
//     // },
//   },
//   plugins: [],
// };
