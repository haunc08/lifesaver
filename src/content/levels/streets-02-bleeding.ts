import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'streets-02',
  areaId: 'streets',
  title: 'Cú ngã ở trạm xe buýt',
  scene: 'Trạm xe buýt',

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Xe buýt sắp tới rồi, mình ra trạm ngồi chờ thôi!',
      mood: 'happy',
    },
    { text: 'Một bác lớn tuổi vấp bậc thềm, ngã chống tay vào mép sắt của băng ghế.' },
    {
      speaker: 'Bác Tư',
      text: 'Ui da… tay bác… máu chảy nhiều quá cháu ơi.',
      mood: 'pain',
    },
    {
      speaker: GUIDE_NAME,
      text: 'Đừng hoảng. Quan sát thật kỹ rồi mình giúp bác nhé!',
      mood: 'worried',
    },
  ],

  observe: {
    clues: [
      {
        id: 'arm',
        label: 'Cẳng tay',
        caption:
          'Cẳng tay trái của bác có vết rách, máu chảy đều và thấm ướt tay áo. Không thấy vật gì cắm trong vết thương.',
        x: 38,
        y: 53,
        essential: true,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Bác Tư tỉnh táo, nói chuyện rõ, chỉ hơi tái vì sợ.',
        x: 46,
        y: 33,
        essential: true,
      },
      {
        id: 'body',
        label: 'Đầu và chân',
        caption: 'Bác không bị đập đầu. Tay phải và hai chân vẫn cử động bình thường.',
        x: 40,
        y: 72,
        essential: true,
      },
      {
        id: 'ground',
        label: 'Chỗ bác ngồi',
        caption:
          'Bác ngồi trên vỉa hè, cách xa lòng đường. Mép sắt băng ghế là thứ làm bác bị thương.',
        x: 14,
        y: 78,
        essential: false,
      },
      {
        id: 'bag',
        label: 'Ba lô của bạn',
        caption: 'Trong ba lô có túi sơ cứu nhỏ: gạc sạch, cuộn băng và đôi găng tay ni lông.',
        x: 72,
        y: 70,
        essential: false,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với bác Tư?',
    options: [
      {
        id: 'scratch',
        text: 'Chỉ là vết xước nhẹ, lau đi là xong',
        correct: false,
        feedback: 'Máu chảy đều và thấm ướt cả tay áo thì không phải vết xước nhẹ.',
      },
      {
        id: 'fracture',
        text: 'Nghi ngờ bác bị gãy tay, phải nẹp trước đã',
        correct: false,
        feedback: 'Tay bác không biến dạng. Việc gấp nhất lúc này là máu đang chảy.',
      },
      {
        id: 'bleeding',
        text: 'Nghi ngờ bác có vết thương chảy máu nhiều ở cẳng tay, cần cầm máu ngay',
        correct: true,
        feedback: 'Đúng rồi: máu chảy đều, thấm ướt tay áo là dấu hiệu cần ép cầm máu ngay.',
      },
      {
        id: 'faint',
        text: 'Nghi ngờ bác bị ngất xỉu',
        correct: false,
        feedback: 'Bác Tư vẫn tỉnh táo và nói chuyện rõ ràng.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'protect', 'press', 'call'],
    options: [
      {
        id: 'press',
        text: 'Đặt gạc sạch lên vết thương và ép chặt, giữ liên tục',
        kind: 'correct',
        feedback: 'Ép chặt trực tiếp lên vết thương là cách cầm máu quan trọng nhất.',
      },
      {
        id: 'leaves',
        text: 'Giã lá cây đắp lên vết thương cho cầm máu',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Lá cây, thuốc lào hay bột lạ làm bẩn vết thương và dễ gây nhiễm trùng.',
      },
      {
        id: 'call',
        text: 'Nhờ người ở trạm gọi 115 trong khi bạn vẫn giữ tay ép',
        kind: 'correct',
        mandatory: true,
        feedback:
          'Máu chảy nhiều cần nhân viên y tế. Nhờ người khác gọi để bạn không phải buông tay.',
      },
      {
        id: 'ticket',
        text: 'Đi tìm xem bác làm rơi vé xe buýt ở đâu',
        kind: 'irrelevant',
        feedback: 'Vé xe để sau cũng được. Lúc này cầm máu cho bác mới là việc gấp.',
      },
      {
        id: 'safe',
        text: 'Nhìn quanh: bác đã ở xa lòng đường và mép sắt sắc chưa',
        kind: 'correct',
        mandatory: true,
        feedback: 'Luôn kiểm tra an toàn xung quanh trước khi lại gần giúp.',
      },
      {
        id: 'band',
        text: 'Lấy dây thun buộc thắt thật chặt cánh tay bác',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Dây thun thắt chặt có thể làm tổn thương cánh tay. Hãy ép trực tiếp lên vết thương.',
      },
      {
        id: 'protect',
        text: 'Đeo găng tay ni lông trước khi chạm vào vết thương',
        kind: 'correct',
        feedback: 'Găng tay hoặc túi ni lông sạch bảo vệ cả bạn và bác khỏi lây nhiễm.',
      },
    ],
  },

  act: {
    type: 'sequence',
    steps: [
      {
        type: 'hold',
        instruction:
          'Ép chặt miếng gạc lên vết thương của bác Tư. Giữ nguyên tay, đừng nhấc lên xem!',
        action: 'Ép chặt miếng gạc',
        holdSec: 6,
        tool: { art: 'item-gauze', x: 38, y: 53 },
        holdingText: 'Giữ đều tay… máu đang chảy chậm lại.',
        releaseText: 'Đừng nhấc tay! Nhấc gạc lên xem sẽ làm máu chảy lại.',
        realityNote:
          'Ngoài đời, cần ép liên tục ít nhất 10 phút, hoặc đến khi nhân viên y tế đến, và không nhấc gạc lên xem.',
      },
      {
        type: 'drag-place',
        instruction: 'Máu đã chậm lại. Đặt gạc vào đúng chỗ; món không nên dùng thì để yên.',
        zones: [
          { id: 'wound', label: 'Trên vết thương', x: 28, y: 52 },
          { id: 'soaked', label: 'Chỗ máu thấm ra ngoài', x: 66, y: 54 },
        ],
        items: [
          {
            id: 'gauze',
            label: 'Gạc sạch',
            art: 'item-gauze',
            zoneId: 'wound',
            wrongNote: 'Gạc sạch cần đặt trực tiếp lên vết thương.',
          },
          {
            id: 'cotton',
            label: 'Bông gòn xé nhỏ',
            art: 'item-cotton',
            zoneId: null,
            wrongNote: 'Bông gòn dễ dính sợi vào vết thương. Hãy dùng gạc sạch.',
          },
          {
            id: 'coffee',
            label: 'Bột cà phê',
            art: 'item-coffee-jar',
            zoneId: null,
            wrongNote: 'Bột cà phê không cầm được máu, lại làm bẩn vết thương.',
          },
          {
            id: 'second-pad',
            label: 'Miếng gạc thứ hai',
            art: 'item-gauze',
            zoneId: 'soaked',
            wrongNote: 'Miếng gạc thứ hai đặt chồng lên chỗ máu thấm ra, không gỡ miếng cũ.',
          },
          {
            id: 'tobacco',
            label: 'Thuốc lào',
            art: 'item-tobacco',
            zoneId: null,
            wrongNote: 'Thuốc lào không cầm được máu và dễ gây nhiễm trùng.',
          },
        ],
      },
      {
        type: 'trace',
        instruction:
          'Giờ quấn băng để giữ lớp gạc: kéo cuộn băng lượn qua lại quanh cánh tay bác Tư.',
        art: 'closeup-streets-02',
        tool: { art: 'item-bandage', label: 'Cuộn băng', size: 15 },
        path: [
          { x: 36, y: 37 },
          { x: 42, y: 66 },
          { x: 48, y: 38 },
          { x: 54, y: 67 },
          { x: 60, y: 40 },
          { x: 65, y: 65 },
        ],
        trail: 'band',
        slipNote:
          'Băng bị tuột khỏi cánh tay rồi. Cầm lại cuộn băng, quấn đều tay theo đường chấm.',
        doneNote: 'Lớp gạc đã được giữ chắc trên vết thương. Bác Tư đỡ lo hẳn.',
        realityNote:
          'Ngoài đời, quấn băng đủ chắc để giữ gạc và vẫn ép lên vết thương, nhưng không siết đến mức bàn tay tím, lạnh hay tê.',
      },
    ],
  },

  outcomes: {
    success:
      'Máu đã ngừng chảy dưới lớp băng gọn gàng. Xe cấp cứu đến, cô y tá khen bạn ép đúng cách và không gỡ lớp gạc cũ.',
    'partial-success':
      'Máu chảy chậm lại và bác Tư được xe cấp cứu đưa đi. Bạn đã giúp được bác, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Chú bảo vệ gần trạm chạy đến giúp ép vết thương và gọi cấp cứu. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Chú bảo vệ gần trạm kịp ngăn lại và gọi cấp cứu. Những cách làm vừa rồi có thể khiến vết thương của bác Tư nặng hơn.',
    timeout:
      'Hết giờ! Chú bảo vệ gần trạm đã đến giúp bác Tư cầm máu. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra ở trạm xe buýt.',
    observe:
      'Chạm vào từng dấu “?” trên hình. Khi đã xem hết những điểm quan trọng, bạn mới kết luận được.',
    assess:
      'Bác Tư tỉnh, tay không biến dạng, nhưng máu chảy đều và thấm ướt tay áo: hãy chọn “Nghi ngờ bác có vết thương chảy máu nhiều ở cẳng tay, cần cầm máu ngay”.',
    choose:
      'Thứ tự đúng: nhìn quanh xem đã an toàn chưa → đeo găng tay → đặt gạc sạch và ép chặt → nhờ người gọi 115.',
    act: 'Bước 1: nhấn giữ nút “Ép chặt miếng gạc” cho đến khi đầy thanh, đừng thả tay. Bước 2: gạc sạch đặt trên vết thương, miếng gạc thứ hai đặt chỗ máu thấm ra; không dùng bông gòn, bột cà phê, thuốc lào. Bước 3: giữ cuộn băng rồi kéo theo đường chấm, lượn qua lại quanh cánh tay cho đến vòng tròn.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-streets-02',
    title: 'Vết thương chảy máu',
    levelId: 'streets-02',
    areaId: 'streets',
    signs: [
      'Máu chảy đều hoặc phun thành tia từ vết thương',
      'Máu thấm ướt quần áo, băng gạc',
      'Nạn nhân tái nhợt, vã mồ hôi lạnh, choáng váng khi mất nhiều máu',
    ],
    principles: [
      'Kiểm tra an toàn xung quanh trước khi lại gần',
      'Đeo găng tay hoặc lót túi ni lông sạch trước khi chạm vào máu',
      'Đặt gạc hoặc vải sạch lên vết thương và ép chặt trực tiếp, giữ liên tục',
      'Nếu máu thấm ra ngoài, đặt thêm lớp gạc mới chồng lên, không gỡ lớp cũ',
      'Khi máu đã chậm lại, quấn băng giữ lớp gạc, đủ chặt nhưng không làm tím tái đầu ngón tay',
      'Cho nạn nhân ngồi hoặc nằm nghỉ, giữ ấm và trấn an',
    ],
    donts: [
      'Không nhấc gạc lên xem khi đang ép',
      'Không rắc thuốc lào, bột cà phê, đắp lá cây hay bất cứ thứ gì lạ lên vết thương',
      'Không dùng bông gòn xé nhỏ nhét vào vết thương',
      'Không tự buộc dây thun, dây chun thắt chặt tay chân',
      'Không rút vật đang cắm trong vết thương; hãy ép xung quanh và gọi cấp cứu',
      'Không bỏ đi lo việc khác khi vết thương còn đang chảy máu',
    ],
    callForHelp: [
      'Máu chảy nhiều, phun thành tia hoặc không chậm lại sau khi ép chặt',
      'Nạn nhân tái nhợt, vã mồ hôi lạnh, lơ mơ hoặc khát nhiều',
      'Vết thương sâu, rộng, có dị vật cắm bên trong',
      'Vết thương do vật bẩn, gỉ sét hoặc do động vật cắn',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
