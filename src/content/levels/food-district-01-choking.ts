import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer). Choking guidance in particular must be
 * reviewed before real players see it.
 */
const level: LevelDef = {
  id: 'food-district-01',
  areaId: 'food-district',
  title: 'Miếng bánh vội vàng',
  scene: 'Tiệm bánh',

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Tiệm bánh này nổi tiếng lắm, bánh mới ra lò thơm quá!',
      mood: 'happy',
    },
    {
      speaker: 'Anh Khoa',
      text: 'Anh sắp trễ ca làm rồi, ăn nhanh miếng này rồi chạy thôi!',
      mood: 'happy',
    },
    { text: 'Anh Khoa vừa ăn vừa nói cười. Bỗng anh im bặt, hai tay ôm lấy cổ.' },
    {
      speaker: GUIDE_NAME,
      text: 'Có gì đó không ổn! Quan sát anh Khoa thật nhanh nào!',
      mood: 'surprised',
    },
  ],

  observe: {
    clues: [
      {
        id: 'hands',
        label: 'Hai bàn tay',
        caption: 'Hai tay anh Khoa ôm chặt lấy cổ. Đây là dấu hiệu thường gặp khi bị hóc.',
        x: 40,
        y: 78,
        essential: true,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Mặt anh Khoa đỏ lên rồi tím dần, mắt mở to hoảng hốt.',
        x: 37,
        y: 48,
        essential: true,
      },
      {
        id: 'sound',
        label: 'Tiếng động',
        caption: 'Anh Khoa không nói được, không ho ra tiếng, cũng không nghe thấy tiếng thở.',
        x: 56,
        y: 62,
        essential: true,
      },
      {
        id: 'table',
        label: 'Trên bàn',
        caption: 'Miếng bánh ăn dở còn trên đĩa. Anh Khoa vừa cắn một miếng to.',
        x: 11,
        y: 76,
        essential: false,
      },
      {
        id: 'owner',
        label: 'Cô chủ tiệm',
        caption: 'Cô chủ tiệm đang đứng sau quầy, có thể nhờ cô gọi cấp cứu.',
        x: 81,
        y: 40,
        essential: false,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với anh Khoa?',
    options: [
      {
        id: 'mild',
        text: 'Anh Khoa chỉ sặc nhẹ, ho vài cái là hết',
        correct: false,
        feedback: 'Anh Khoa không ho được, không nói được. Đây không còn là sặc nhẹ.',
      },
      {
        id: 'choking',
        text: 'Nghi ngờ anh Khoa bị hóc dị vật, đường thở tắc nặng',
        correct: true,
        feedback:
          'Đúng rồi: đang ăn thì ôm cổ, không nói, không ho, không thở được là dấu hiệu gợi ý hóc dị vật nặng.',
      },
      {
        id: 'faint',
        text: 'Nghi ngờ anh Khoa bị ngất xỉu',
        correct: false,
        feedback: 'Anh Khoa vẫn đứng và còn tỉnh, chỉ là không thở được.',
      },
      {
        id: 'seizure',
        text: 'Nghi ngờ anh Khoa lên cơn co giật',
        correct: false,
        feedback: 'Tay chân anh Khoa không co cứng hay giật. Anh đang ôm cổ vì không thở được.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì?',
    order: ['safe', 'ask', 'call', 'blows'],
    options: [
      {
        id: 'water',
        text: 'Đưa nước cho anh Khoa uống để trôi miếng bánh',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Nước không làm trôi dị vật mà còn có thể khiến đường thở tắc nặng hơn.',
      },
      {
        id: 'blows',
        text: 'Cho anh Khoa cúi ra trước, vỗ lưng 5 lần; chưa ra thì ép bụng 5 lần, luân phiên',
        kind: 'correct',
        feedback: 'Vỗ lưng và ép bụng luân phiên giúp đẩy dị vật ra khỏi đường thở.',
      },
      {
        id: 'call',
        text: 'Nhờ cô chủ tiệm gọi 115 ngay',
        kind: 'correct',
        mandatory: true,
        feedback: 'Tắc đường thở nặng là cấp cứu. Nhờ người khác gọi để bạn giúp anh Khoa ngay.',
      },
      {
        id: 'tidy',
        text: 'Dọn đĩa bánh và lau bàn cho gọn',
        kind: 'irrelevant',
        feedback: 'Bàn để sau dọn cũng được. Anh Khoa đang cần được giúp từng giây.',
      },
      {
        id: 'safe',
        text: 'Nhìn nhanh xung quanh, đẩy ghế và ly tách ra xa để có chỗ đứng vững',
        kind: 'correct',
        mandatory: true,
        feedback: 'Chỗ đứng vững và thoáng giúp bạn giúp anh Khoa an toàn.',
      },
      {
        id: 'finger',
        text: 'Thò ngón tay vào miệng anh Khoa móc miếng bánh ra',
        kind: 'unsafe',
        feedback: 'Không an toàn! Móc khi không nhìn thấy dị vật có thể đẩy nó vào sâu hơn.',
      },
      {
        id: 'ask',
        text: 'Hỏi to “Anh bị hóc phải không?” và xem anh có nói, có ho được không',
        kind: 'correct',
        feedback: 'Nếu còn ho được thì khuyến khích ho. Không nói, không ho được là tắc nặng.',
      },
    ],
  },

  act: {
    type: 'quick-decision',
    instruction: 'Phải quyết định thật nhanh! Việc nào nên làm, việc nào không?',
    answers: ['Nên làm', 'Không nên'],
    secPerCard: 12,
    cards: [
      {
        id: 'encourage-cough',
        text: 'Người bị hóc còn ho được thành tiếng: bảo họ cứ tiếp tục ho',
        answer: 0,
        why: 'Ho là cách đẩy dị vật ra tốt nhất. Hãy ở bên và theo dõi.',
      },
      {
        id: 'give-water',
        text: 'Đưa nước cho anh Khoa uống để trôi miếng bánh',
        answer: 1,
        why: 'Nước không làm trôi dị vật mà có thể khiến tắc nặng hơn.',
      },
      {
        id: 'call-115',
        text: 'Anh Khoa không thở, không nói, không ho được: nhờ người gọi 115 ngay',
        answer: 0,
        why: 'Tắc đường thở nặng là cấp cứu, cần gọi trợ giúp sớm.',
      },
      {
        id: 'back-blows',
        text: 'Cho anh Khoa cúi ra trước, vỗ mạnh tối đa 5 lần vào giữa hai xương bả vai',
        answer: 0,
        why: 'Vỗ lưng dứt khoát khi người cúi về trước giúp đẩy dị vật ra ngoài.',
      },
      {
        id: 'blind-sweep',
        text: 'Thò ngón tay vào miệng anh Khoa móc tìm dù không nhìn thấy gì',
        answer: 1,
        why: 'Móc mò có thể đẩy dị vật vào sâu hơn. Chỉ lấy ra khi nhìn thấy rõ.',
      },
      {
        id: 'abdominal-thrusts',
        text: 'Vỗ lưng 5 lần chưa ra: đứng phía sau, ép bụng tối đa 5 lần, rồi luân phiên',
        answer: 0,
        why: 'Luân phiên 5 lần vỗ lưng và 5 lần ép bụng cho đến khi dị vật ra hoặc cấp cứu đến.',
      },
      {
        id: 'slap-while-coughing',
        text: 'Thấy người đang ho mạnh được, liền vỗ thật mạnh vào lưng khi họ đứng thẳng',
        answer: 1,
        why: 'Khi còn ho tốt, hãy để họ tự ho. Vỗ lưng lúc đứng thẳng có thể làm dị vật tụt sâu hơn.',
      },
    ],
  },

  outcomes: {
    success:
      'Miếng bánh bật ra! Anh Khoa ho sặc sụa rồi thở lại được. Nhân viên cấp cứu đến kiểm tra và khen bạn đã làm đúng từng bước.',
    'partial-success':
      'Miếng bánh đã ra và anh Khoa thở lại được. Nhân viên cấp cứu đến kiểm tra cho anh. Bạn đã giúp được anh, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Cô chủ tiệm chạy đến giúp anh Khoa và gọi cấp cứu. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Cô chủ tiệm kịp ngăn lại, giúp anh Khoa và gọi cấp cứu. Những cách làm vừa rồi có thể khiến anh Khoa gặp nguy hiểm hơn.',
    timeout:
      'Hết giờ! Cô chủ tiệm đã chạy đến giúp anh Khoa và gọi cấp cứu. Khi có người bị hóc, hãy quyết định thật nhanh nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra ở tiệm bánh.',
    observe:
      'Chạm vào từng dấu “?” trên hình. Khi đã xem hết những điểm quan trọng, bạn mới kết luận được.',
    assess:
      'Anh Khoa đang ăn thì ôm cổ, không nói, không ho, không thở được: hãy chọn “Nghi ngờ anh Khoa bị hóc dị vật, đường thở tắc nặng”.',
    choose:
      'Thứ tự đúng: nhìn quanh và dọn chỗ đứng → hỏi “Anh bị hóc phải không?” → nhờ cô chủ tiệm gọi 115 → cho cúi ra trước, vỗ lưng 5 lần rồi ép bụng 5 lần, luân phiên.',
    act: 'Nên làm: bảo người còn ho được tiếp tục ho, gọi 115, vỗ lưng khi cúi ra trước, ép bụng luân phiên với vỗ lưng. Không nên: cho uống nước, móc miệng khi không nhìn thấy gì, vỗ lưng người đang đứng thẳng và còn ho tốt.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-food-district-01',
    title: 'Hóc dị vật ở người lớn',
    levelId: 'food-district-01',
    areaId: 'food-district',
    signs: [
      'Đang ăn thì đột ngột ôm lấy cổ',
      'Tắc nhẹ: vẫn ho được thành tiếng, vẫn nói và thở được',
      'Tắc nặng: không nói được, không ho được hoặc ho yếu không ra tiếng, không thở được',
      'Mặt đỏ rồi tím tái, hoảng hốt',
    ],
    principles: [
      'Hỏi “Bạn bị hóc phải không?”; nếu còn ho được, khuyến khích tiếp tục ho và ở bên theo dõi',
      'Nếu không nói, không ho, không thở được: nhờ người gọi 115 ngay',
      'Cho nạn nhân cúi người ra trước, vỗ mạnh tối đa 5 lần vào giữa hai xương bả vai',
      'Nếu dị vật chưa ra: đứng phía sau, ép bụng (trên rốn, dưới xương ức) tối đa 5 lần',
      'Luân phiên 5 lần vỗ lưng và 5 lần ép bụng cho đến khi dị vật ra hoặc cấp cứu đến',
      'Sau khi đã ép bụng, nạn nhân nên được nhân viên y tế kiểm tra lại',
    ],
    donts: [
      'Không cho uống nước hay ăn thêm để “trôi” dị vật',
      'Không thò tay móc khi không nhìn thấy dị vật',
      'Không vỗ lưng khi nạn nhân đang đứng thẳng và còn ho tốt',
      'Không để nạn nhân một mình đi vào nhà vệ sinh hay ra chỗ vắng',
      'Không mất thời gian vào việc khác: người hóc nặng cần được giúp ngay',
    ],
    callForHelp: [
      'Nạn nhân không nói, không ho, không thở được',
      'Nạn nhân tím tái hoặc lả dần đi',
      'Nạn nhân bất tỉnh: đỡ nằm xuống, gọi 115 và làm theo hướng dẫn của tổng đài',
      'Sau khi dị vật ra mà vẫn ho kéo dài, khó nuốt hoặc đau',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
