const layoutConfig = {
    position:{
      bronze: {
        mailboxPosition: [0.75, -1, 1.5],
        videoPosition: [-1.06, 0.0, -0],
        screenPosition:[-7.3, -0, -0.01],
        planeVideoPosition: [-1.1, 0, 0],
        computerPosition:[0, -0.6, 0.74],
        catalogPosition: [-1.1, 0, 1],
        chatbotPosition: [1, -1, -0.8],
        scheduleMeetingPosition: [-1.1, 0, -1],
        companyLogoPosition: [0.05, 1.2, 0],
        companyLogoPosition2: [0.05, 1.2, 0],
        
      },
      silver: {
        mailboxPosition: [-2, -0.75, 3.5],
        videoPosition: [0.83, 0.44, -1.5],
        screenPosition:[-10.9, 2.6, 3.03],
        planeVideoPosition: [0.8, 0, -1.6],
        computerPosition:[1., -0.191, 2.2],
        catalogPosition: [1.45, 0.04, 2.3],
        chatbotPosition: [-1, -0.78, 4],
        scheduleMeetingPosition: [-1.85, -0.2, 1.89],
        companyLogoPosition: [-1.9, 1, 1.75],
        companyLogoPosition2: [1.05, -0.45, 2.54],

      },
      gold: {
        mailboxPosition: [3, -1, 2.5],
        videoPosition: [-2.75, 0.13, -0.7],
        planeVideoPosition: [-3.1, 0, -0],
        screenPosition:[-18.9, -0.7, 0.9],
        catalogPosition: [1.25, 0, 3.48],
        computerPosition:[0.5, -0.29, 1.56],
        chatbotPosition: [1, -0.95, 0.3],
        scheduleMeetingPosition: [2.85, -0.2, -1.9],
        companyLogoPosition: [-2, 0.4, -3],
        companyLogoPosition2: [-3.4, 0.4, 1.69],


      },
    },
    rotation:{
      bronze: {
        mailboxRotation: [0,- Math.PI ,0],
        videoRotation: [0, Math.PI / 2, 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI],
        planeVideoRotation: [0, -1.58, 0],
        computerRotation:[0, Math.PI/100, 0],
        catalogRotation: [0, Math.PI / 2, 0],
        chatbotRotation: [0, Math.PI/2 , 0],
        scheduleMeetingRotation: [0, 0,0],
        companyLogoRotation: [0,1.57,0],
        companyLogoRotation2: [0,1.57,0],

      },
      silver: {
        mailboxRotation: [0, Math.PI / 2,0],
        videoRotation: [0, -1 *  Math.PI / 12 , 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI / 2.42],
        planeVideoRotation: [0, 2.9, 0],
        computerRotation:[0, 4.45, 0],
        catalogRotation: [0, -0.3, 0],
        chatbotRotation: [0, -Math.PI/10 , 0],
        scheduleMeetingRotation: [0, -1.8, 0],
        companyLogoRotation: [0, -0.2, 0],
        companyLogoRotation2: [0, -0.25, 0],

      },
      gold: {
        mailboxRotation: [0, Math.PI / 1,0],
        videoRotation: [0, -1 *  Math.PI / -2.4 , 0],
        screenRotation:[Math.PI / 2, Math.PI, Math.PI / 1.1],
        planeVideoRotation: [0, -1.85, 0],
        computerRotation:[0, Math.PI / 12, 0],
        catalogRotation: [0, 1.3, 0],
        chatbotRotation: [0, 1.3 , 0],
        scheduleMeetingRotation: [0, -0.3, 0],
        companyLogoRotation: [0, 1.3, 0],
        companyLogoRotation2: [0, 1.3, 0],
      },
    }
  };

  export default layoutConfig;
