const layoutConfig = {
    position:{
      bronze: {
        mailboxPosition: [0.75, -1, 1.5],
        videoPosition: [0.3, 0.0, -0],
        screenPosition:[-13.7, -0, -0.01],
        computerPosition:[0, -0.6, 0.74],
        catalogPosition: [0.37, -0.29, -1.43],
        chatbotPosition: [1, -0.16, -0.5],
        scheduleMeetingPosition: [-0.28, -0.29, 0],
        companyLogoPosition: [0, 1.2, 0]
      },
      silver: {
        mailboxPosition: [-2, -1, 3.5],
        videoPosition: [0.54, 0.0, -1.92],
        screenPosition:[-25.2, 0, -0.03],
        computerPosition:[0.7, -0.37, 1.6],
        catalogPosition: [0.6, -0.55, 1.93],
        chatbotPosition: [0, -0.2, -1],
        scheduleMeetingPosition: [-1.68, -0.2, 1.15],
        companyLogoPosition: [-2.5, 0, 2]

      },
      gold: {
        mailboxPosition: [3, -1, 2.5],
        videoPosition: [-2.45, 0.0, -0.7],
        screenPosition:[-32, 0, -0.03],
        catalogPosition: [1.6, -0.4, -1.3],
        computerPosition:[0.7, -0.4, 1.95],
        chatbotPosition: [0, -0.2, -1],
        scheduleMeetingPosition: [3.24, -0.2, -2],
        companyLogoPosition: [5, 0, 0]

      },
    },
    rotation:{
      bronze: {
        mailboxRotation: [0,- Math.PI ,0],
        videoRotation: [0, Math.PI / 2, 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI],
        computerRotation:[0, Math.PI/100, 0],
        catalogRotation: [0, Math.PI / 2, 0],
        chatbotRotation: [0, Math.PI , 0],
        scheduleMeetingRotation: [Math.PI/2, 0, Math.PI/2],
        companyLogoRotation: [0, 0, 0],

      },
      silver: {
        mailboxRotation: [0, Math.PI / 2,0],
        videoRotation: [0, -1 *  Math.PI / 12 , 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI / 2.42],
        computerRotation:[0, Math.PI / 2.45, 0],
        catalogRotation: [0, -0.3, 0],
        chatbotRotation: [0, -Math.PI/10 , 0],
        scheduleMeetingRotation: [Math.PI/2, 0, Math.PI/-2.4],
        companyLogoRotation: [0, 0, 0],

      },
      gold: {
        mailboxRotation: [0, Math.PI / 1,0],
        videoRotation: [0, -1 *  Math.PI / -2.4 , 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI / 1.1],
        computerRotation:[0, Math.PI / 12, 0],
        catalogRotation: [0, 1, 0],
        chatbotRotation: [0, -Math.PI/10 , 0],
        scheduleMeetingRotation: [Math.PI/2, 0, Math.PI/-2.5],
        companyLogoRotation: [0, 0, 0],
      },
    }
  };

  export default layoutConfig;
