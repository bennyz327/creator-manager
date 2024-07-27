export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// import { Transform } from 'stream';
// import { Console } from 'console';
// export const table = (input: any) => {
//     const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
//     const logger = new Console({ stdout: ts })
//     logger.table(input)
//     const table = (ts.read() || '').toString()
//     let result = '';
//     for (let row of table.split(/[\r\n]+/)) {
//       let r = row.replace(/[^┬]*┬/, '┌');
//       r = r.replace(/^├─*┼/, '├');
//       r = r.replace(/│[^│]*/, '');
//       r = r.replace(/^└─*┴/, '└');
//       r = r.replace(/'/g, ' ');
//       result += `${r}\n`;
//     }
//     console.log(result);
// }