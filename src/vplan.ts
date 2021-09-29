//
// export async function vPlanCron(lastModified: Date): Promise<unknown> {
//   const passedTime = formatRelativeTime(Date.parse(modified) - Date.now());
//
//   const iteration = getIteration();
//   const message = `Der Vertretungsplan wurde ${passedTime} aktualisiert.`;
//   const messageWithoutImage = `${message} Hier die Änderungen ansehen ${V_PLAN_URL}. Der aktuelle Turnus ist ${iteration}.`;
//
//   return Promise.all([
//     setStoredLastModified(modified),
//     notify(
//       `${message} Der aktuelle Turnus ist ${iteration}.`,
//       await fetchVPlan(
//         formatDateTime(new Date(modified)),
//         `${passedTime} aktualisiert`,
//         `Turnus ${iteration}`
//       ),
//       messageWithoutImage
//     ),
//   ]);
// }
