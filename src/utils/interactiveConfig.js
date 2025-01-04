const layoutConfig = {
    position:{
      bronze: {
        mailboxPosition: [0.6, -1, -1.3],
        videoPosition: [0.29, 0.0, -0],
        screenPosition:[3.5, -8.2, -0.01],
        computerPosition:[0, -0.4, -0.3],
        catalogPosition: [0, -0.29, 0.33],
        chatbotPosition: [0, -0.2, -1],
      },
      silver: {
        mailboxPosition: [-1, -1, 3.5],
        videoPosition: [0.29, 0.0, -0],
        screenPosition:[-25.1, -8.2, -0.03],
        computerPosition:[0.7, -0.37, 1.6],
        catalogPosition: [0.6, -0.55, 1.93],
        chatbotPosition: [0, -0.2, -1],
      },
      gold: {
        mailboxPosition: [-1.5, -0.5, 4],
        videoPosition: [0.4, 0.4, 4.5],
        catalogPosition: [0.7, -0.5, 4.3],
      },
    },
    rotation:{
      bronze: {
        mailboxRotation: [0,- Math.PI / 2,0],
        videoRotation: [0, Math.PI / 2, 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI],
        computerRotation:[0, Math.PI / 2, 0],
        catalogRotation: [-0.1, 0, 0],
        chatbotRotation: [0, Math.PI , 0],
      },
      silver: {
        mailboxRotation: [0, Math.PI / 2,0],
        videoRotation: [0, Math.PI / 40, 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI / 2.42],
        computerRotation:[0, Math.PI / 2.45, 0],
        catalogRotation: [0, -0.3, 0],
        chatbotRotation: [0, -Math.PI/10 , 0],
      },
      gold: {
        mailboxRotation: [-1.5, -0.5, 4],
        videoRotation: [0.4, 0.4, 4.5],
        catalogRotation: [0.7, -0.5, 4.3],
      },
    }
  };

  export default layoutConfig;
