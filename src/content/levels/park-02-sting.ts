import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'park-02',
  areaId: 'park',
  title: 'Vị khách không mời',
  scene: 'Bãi dã ngoại',

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Thảm cỏ cạnh bồn hoa đẹp quá, bảo sao nhà nào cũng ra đây dã ngoại.',
      mood: 'happy',
    },
    {
      speaker: 'Bé Na',
      text: 'Anh chị ơi giúp em với! Chị Mai em vừa bị con gì đốt vào tay!',
      mood: 'worried',
    },
    {
      speaker: 'Chị Mai',
      text: 'Ui da… rát quá! Chị vừa cầm cốc nước cam lên thì bị ong đốt.',
      mood: 'pain',
    },
    {
      speaker: GUIDE_NAME,
      text: 'Đừng cuống. Xem kỹ vết đốt, và cả gương mặt, hơi thở của chị ấy nữa nhé!',
      mood: 'surprised',
    },
  ],

  observe: {
    clues: [
      {
        id: 'arm',
        label: 'Cẳng tay',
        caption:
          'Trên cẳng tay chị Mai có một nốt sưng đỏ, ở giữa còn cắm một chiếc ngòi nhỏ màu đen.',
        x: 46,
        y: 64,
        essential: true,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Mặt, môi và mắt chị Mai không sưng. Chị ấy nói chuyện rõ ràng.',
        x: 47,
        y: 45,
        essential: true,
      },
      {
        id: 'breath',
        label: 'Hơi thở',
        caption: 'Chị Mai thở đều, không khò khè, không kêu tức ngực hay chóng mặt.',
        x: 61,
        y: 55,
        essential: true,
      },
      {
        id: 'bees',
        label: 'Bồn hoa',
        caption: 'Mấy con ong vẫn bay quanh bồn hoa và cốc nước cam ngay cạnh chỗ ngồi.',
        x: 72,
        y: 12,
        essential: false,
      },
      {
        id: 'skin',
        label: 'Làn da',
        caption: 'Ngoài nốt đốt, da ở cổ, ngực và tay chân chị Mai không nổi mẩn đỏ.',
        x: 48,
        y: 82,
        essential: false,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với chị Mai?',
    options: [
      {
        id: 'severe',
        text: 'Nghi ngờ chị Mai đang bị dị ứng nặng toàn thân',
        correct: false,
        feedback:
          'Chị Mai không khó thở, không sưng mặt hay môi, không nổi mẩn khắp người. Nhưng các dấu hiệu này có thể đến sau, nên vẫn phải theo dõi.',
      },
      {
        id: 'snake',
        text: 'Nghi ngờ chị Mai bị rắn cắn',
        correct: false,
        feedback: 'Vết thương chỉ có một nốt với chiếc ngòi nhỏ, và ong đang bay ngay bên cạnh.',
      },
      {
        id: 'local',
        text: 'Nghi ngờ chị Mai bị ong đốt, mới chỉ sưng đau tại chỗ',
        correct: true,
        feedback:
          'Đúng rồi: có ngòi ong, sưng đỏ quanh vết đốt, còn hơi thở và gương mặt vẫn bình thường. Vẫn phải theo dõi tiếp nhé.',
      },
      {
        id: 'scratch',
        text: 'Chị Mai chỉ bị gai hoa cào xước',
        correct: false,
        feedback: 'Vết xước không để lại ngòi và không sưng đỏ nhanh như vậy.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì?',
    order: ['safe', 'stinger', 'call', 'care'],
    options: [
      {
        id: 'care',
        text: 'Rửa vết đốt bằng xà phòng và nước, chườm túi đá bọc khăn, kê cao tay',
        kind: 'correct',
        feedback: 'Rửa sạch giúp tránh nhiễm trùng; chườm lạnh và kê cao tay giúp giảm sưng đau.',
      },
      {
        id: 'suck',
        text: 'Nặn vết đốt rồi dùng miệng hút nọc ra',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Nặn bóp đẩy thêm nọc vào da, còn hút bằng miệng dễ gây nhiễm trùng và hại cho chính bạn.',
      },
      {
        id: 'safe',
        text: 'Bình tĩnh đưa hai chị em ra xa bồn hoa, không đập hay xua ong',
        kind: 'correct',
        mandatory: true,
        feedback:
          'Rời xa đàn ong trước để không ai bị đốt thêm. Đập hay xua mạnh làm ong hung hơn.',
      },
      {
        id: 'photo',
        text: 'Chụp ảnh con ong để tra xem nó thuộc loài gì',
        kind: 'irrelevant',
        feedback:
          'Biết tên loài ong lúc này không giúp gì cho chị Mai, lại khiến bạn đứng gần ong lâu hơn.',
      },
      {
        id: 'call',
        text: 'Báo người lớn đi cùng hoặc bảo vệ công viên; sẵn sàng gọi 115 nếu khó thở, sưng mặt',
        kind: 'correct',
        mandatory: true,
        feedback:
          'Phản ứng nặng có thể đến rất nhanh, nên cần có người lớn hỗ trợ và sẵn sàng gọi 115.',
      },
      {
        id: 'stinger',
        text: 'Dùng cạnh thẻ cứng gạt ngang để lấy ngòi ong ra',
        kind: 'correct',
        feedback: 'Lấy ngòi ra càng sớm càng tốt; gạt ngang để không bóp thêm nọc vào da.',
      },
      {
        id: 'lime',
        text: 'Bôi vôi hoặc nước mắm lên vết đốt',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Vôi có thể làm bỏng da, còn nước mắm dễ khiến vết đốt nhiễm trùng.',
      },
    ],
  },

  act: {
    type: 'sequence',
    steps: [
      {
        type: 'trace',
        instruction:
          'Ngòi ong còn cắm trên tay chị Mai. Dùng cạnh thẻ gạt ngang qua để hất ngòi ra.',
        art: 'closeup-park-02',
        tool: { art: 'item-card', label: 'Chiếc thẻ cứng', size: 18 },
        path: [
          { x: 30, y: 46 },
          { x: 70, y: 50 },
        ],
        trail: 'none',
        speck: { x: 50, y: 47 },
        slipNote:
          'Thẻ trượt khỏi tay chị Mai rồi. Đặt lại cạnh thẻ và gạt ngang một đường qua ngòi ong.',
        doneNote: 'Ngòi ong đã bật ra mà không bị bóp nặn.',
        realityNote:
          'Ngoài đời, gạt ngang sát mặt da bằng cạnh thẻ hoặc móng tay. Không bóp, nặn ngòi vì sẽ đẩy thêm nọc vào da.',
      },
      {
        type: 'rub',
        instruction: 'Rửa vết đốt: chà nhẹ xà phòng với nước lên chỗ sưng.',
        art: 'closeup-park-02',
        tool: { art: 'item-soap', label: 'Xà phòng và nước' },
        spots: [{ id: 'sting', label: 'Chỗ bị đốt', x: 50, y: 48 }],
        doneNote: 'Vết đốt đã sạch.',
        realityNote:
          'Ngoài đời, rửa nhẹ nhàng bằng xà phòng và nước sạch rồi thấm khô; không chà xát mạnh lên chỗ sưng.',
      },
      {
        type: 'tap-targets',
        instruction:
          'Chăm sóc tiếp cho chị Mai: chạm vào từng việc cần làm. Có việc không nên làm đâu nhé!',
        targets: [
          { id: 'cold', label: 'Chườm đá bọc khăn', x: 75, y: 80 },
          { id: 'raise', label: 'Kê cao cánh tay', x: 46, y: 63 },
          { id: 'watch', label: 'Theo dõi hơi thở', x: 48, y: 40 },
        ],
        decoys: [
          {
            id: 'bare-ice',
            label: 'Áp thẳng viên đá lên da',
            x: 65,
            y: 64,
            note: 'Không chườm đá trực tiếp lên da: dễ gây bỏng lạnh. Luôn bọc đá trong khăn.',
          },
          {
            id: 'swat',
            label: 'Đập đuổi đàn ong',
            x: 53,
            y: 12,
            note: 'Không xua hay đập ong: chúng sẽ đốt thêm. Bình tĩnh tránh ra xa là đủ.',
          },
        ],
      },
    ],
  },

  outcomes: {
    success:
      'Chỗ sưng trên tay chị Mai dịu dần, chị vẫn thở đều và cười được rồi. Mẹ hai chị em quay lại, cảm ơn bạn đã bình tĩnh và làm đúng từng bước.',
    'partial-success':
      'Chị Mai đỡ đau và được mẹ đưa về nghỉ, tiếp tục theo dõi. Bạn đã giúp được chị ấy, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Mẹ hai chị em quay lại kịp và chăm sóc vết đốt cho chị Mai. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Mẹ hai chị em kịp ngăn lại và xử lý vết đốt cho chị Mai. Những cách làm vừa rồi có thể khiến vết đốt nặng thêm.',
    timeout:
      'Hết giờ! Mẹ hai chị em đã quay lại chăm sóc chị Mai. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe:
      'Chạm vào từng dấu “?” trên hình. Khi đã xem hết những điểm quan trọng, bạn mới kết luận được.',
    assess:
      'Có ngòi ong, sưng đỏ quanh vết đốt, vẫn thở đều, mặt không sưng: hãy chọn “Nghi ngờ chị Mai bị ong đốt, mới chỉ sưng đau tại chỗ”.',
    choose:
      'Thứ tự đúng: đưa hai chị em ra xa bồn hoa → gạt ngòi ong bằng cạnh thẻ → báo người lớn, sẵn sàng gọi 115 → rửa xà phòng, chườm đá bọc khăn, kê cao tay.',
    act: 'Bước 1: giữ chiếc thẻ rồi kéo ngang theo đường chấm, qua ngòi ong. Bước 2: giữ bánh xà phòng, kéo lên hình và chà qua lại lên chỗ sưng cho đến khi vòng tròn đầy. Bước 3: chạm chườm đá bọc khăn, kê cao cánh tay và theo dõi hơi thở; đừng chạm việc áp thẳng đá lên da hay đập ong.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-park-02',
    title: 'Ong và côn trùng đốt',
    levelId: 'park-02',
    areaId: 'park',
    signs: [
      'Đau rát đột ngột, sưng đỏ quanh vết đốt',
      'Có thể còn chiếc ngòi nhỏ màu sẫm cắm trên da',
      'Ngứa và sưng tại chỗ, thường dịu dần sau vài giờ',
    ],
    principles: [
      'Bình tĩnh rời xa nơi có ong, không đập hay xua mạnh',
      'Lấy ngòi ra càng sớm càng tốt bằng cách gạt ngang với cạnh thẻ cứng',
      'Rửa vết đốt bằng xà phòng và nước sạch',
      'Chườm túi đá bọc khăn khoảng 10 phút, kê cao tay hoặc chân bị đốt',
      'Tiếp tục theo dõi hơi thở, gương mặt và làn da của nạn nhân',
    ],
    donts: [
      'Không dùng ngón tay bóp, nặn ngòi vì có thể đẩy thêm nọc vào da',
      'Không hút nọc bằng miệng',
      'Không bôi vôi, nước mắm, kem đánh răng hay các mẹo dân gian khác',
      'Không chườm đá trực tiếp lên da',
      'Không nán lại gần ong để chụp ảnh, xua hay đập chúng',
    ],
    callForHelp: [
      'Khó thở, thở khò khè, tức ngực',
      'Sưng mặt, môi, lưỡi hoặc họng',
      'Nổi mẩn khắp người, chóng mặt, choáng hoặc ngất',
      'Bị đốt trong miệng, họng, hoặc bị rất nhiều con đốt',
      'Nếu nạn nhân có mang bút tiêm adrenaline: giúp họ tự dùng và gọi 115 ngay',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
