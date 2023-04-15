window.addLabelToCard = async (t, cardId, labelId) => {
  await window.authCheck(t);

  return new Promise((resolve, reject) => {
    window.Trello.post(
      `/cards/${cardId}/idLabels?value=${labelId}`,
      null,
      (data) => {
        console.log("Label added successfully.");
        console.log(JSON.stringify(data, null, 2));
        resolve(data);
      },
      (fail) => reject(fail)
    );
  });
};