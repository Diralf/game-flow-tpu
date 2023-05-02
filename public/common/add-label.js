window.addLabelToCard = async (t, cardId, labelId) => {
  await window.authCheck(t);

  return new Promise((resolve, reject) => {
    window.Trello.post(
      `/cards/${cardId}/idLabels?value=${labelId}`,
      null,
      (data) => {
        console.log("Label added successfully.");
        resolve(data);
      },
      (fail) => reject(fail)
    );
  });
};