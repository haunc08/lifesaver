import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'dormitory-01',
  areaId: 'dormitory',
  title: 'Đĩa trái cây đêm khuya',
  scene: 'Phòng ký túc xá',

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Mười một giờ đêm, cả phòng vừa ôn thi xong. Mai xung phong gọt xoài đãi mọi người!',
      mood: 'happy',
    },
    { text: 'Con dao trượt khỏi vỏ xoài. Mai kêu khẽ một tiếng rồi nắm chặt ngón tay trỏ.' },
    { speaker: 'Mai', text: 'Á… tớ cắt vào tay rồi. Hình như đang chảy máu.', mood: 'pain' },
    {
      speaker: GUIDE_NAME,
      text: 'Không sao đâu Mai. Để tụi mình xem vết thương thế nào đã nhé.',
      mood: 'worried',
    },
  ],

  observe: {
    clues: [
      {
        id: 'finger',
        label: 'Ngón tay',
        caption: 'Một vết cắt nhỏ và nông ở ngón trỏ. Máu rỉ ra chậm, không chảy thành dòng.',
        x: 43,
        y: 49,
        essential: true,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Mai hơi sợ nhưng vẫn tỉnh táo, không choáng váng.',
        x: 57,
        y: 43,
        essential: true,
      },
      {
        id: 'knife',
        label: 'Con dao',
        caption: 'Con dao gọt trái cây còn nằm ở mép bàn, lưỡi chĩa ra ngoài.',
        x: 48,
        y: 71,
        essential: true,
      },
      {
        id: 'kit',
        label: 'Hộp y tế',
        caption: 'Trên kệ có hộp y tế của phòng: gạc sạch, băng cá nhân và nước muối sinh lý.',
        x: 84,
        y: 14,
        essential: false,
      },
      {
        id: 'sink',
        label: 'Bồn rửa',
        caption: 'Bồn rửa có vòi nước sạch và xà phòng để rửa tay.',
        x: 88,
        y: 80,
        essential: false,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với Mai?',
    options: [
      {
        id: 'severe',
        text: 'Nghi ngờ Mai bị đứt mạch máu lớn',
        correct: false,
        feedback: 'Máu chỉ rỉ ra chậm, không phun thành tia hay chảy ồ ạt.',
      },
      {
        id: 'cut',
        text: 'Nghi ngờ Mai bị đứt tay nhẹ, vết cắt nông',
        correct: true,
        feedback:
          'Đúng rồi: vết cắt nhỏ, nông, máu rỉ chậm gợi ý một vết đứt tay nhẹ có thể sơ cứu tại chỗ.',
      },
      {
        id: 'burn',
        text: 'Nghi ngờ Mai bị bỏng',
        correct: false,
        feedback: 'Ở đây không có gì nóng cả. Mai bị dao cắt vào ngón tay.',
      },
      {
        id: 'nothing',
        text: 'Chỉ xước da thôi, cứ kệ là tự khỏi',
        correct: false,
        feedback: 'Vết cắt đang chảy máu, cần được cầm máu và che lại để tránh nhiễm bẩn.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'press', 'call', 'cover'],
    options: [
      {
        id: 'toothpaste',
        text: 'Bôi kem đánh răng lên vết cắt',
        kind: 'unsafe',
        feedback: 'Không an toàn! Kem đánh răng không cầm máu mà còn làm bẩn và xót vết thương.',
      },
      {
        id: 'press',
        text: 'Dùng gạc sạch ép chặt lên vết cắt và giữ yên',
        kind: 'correct',
        feedback: 'Ép trực tiếp và giữ yên là cách cầm máu hiệu quả nhất.',
      },
      {
        id: 'cover',
        text: 'Khi máu đã cầm, rửa vết cắt bằng nước sạch rồi băng lại',
        kind: 'correct',
        feedback: 'Rửa sạch và che kín giúp vết cắt không bị nhiễm bẩn.',
      },
      {
        id: 'safe',
        text: 'Cất con dao vào chỗ an toàn và rửa sạch tay mình',
        kind: 'correct',
        mandatory: true,
        feedback: 'Dẹp vật sắc nhọn và giữ tay sạch trước khi chạm vào vết thương.',
      },
      {
        id: 'finish',
        text: 'Gọt nốt đĩa xoài cho xong rồi tính',
        kind: 'irrelevant',
        feedback: 'Việc này không giúp gì cho Mai lúc này.',
      },
      {
        id: 'call',
        text: 'Nhờ bạn cùng phòng báo cô quản lý ký túc xá; sẵn sàng gọi 115 nếu máu không cầm',
        kind: 'correct',
        mandatory: true,
        feedback: 'Có người lớn biết chuyện thì Mai sẽ được giúp ngay nếu vết thương nặng hơn.',
      },
      {
        id: 'powder',
        text: 'Rắc bột cà phê hoặc thuốc lào lên cho cầm máu',
        kind: 'unsafe',
        feedback: 'Không an toàn! Những thứ này không sạch và dễ làm vết thương nhiễm trùng.',
      },
    ],
  },

  act: {
    type: 'sequence',
    steps: [
      {
        type: 'hold',
        instruction: 'Cầm máu cho Mai: ép miếng gạc sạch lên vết cắt và giữ đều tay.',
        action: 'Ép chặt miếng gạc',
        holdSec: 6,
        tool: { art: 'item-gauze', x: 43, y: 49 },
        holdingText: 'Giữ đều tay, đừng nhấc gạc lên xem…',
        releaseText: 'Nhấc gạc lên sớm thì máu lại rỉ ra. Ép lại và giữ yên nhé.',
        realityNote:
          'Ngoài đời, cần ép liên tục khoảng 10 phút và không nhấc gạc lên xem giữa chừng. Nếu máu thấm ướt gạc, đặt thêm lớp gạc mới lên trên.',
      },
      {
        type: 'trace',
        instruction: 'Máu đã cầm và vết cắt đã được rửa sạch. Quấn băng gạc che vết cắt cho Mai.',
        art: 'closeup-dormitory-01',
        tool: { art: 'item-bandage', label: 'Cuộn băng gạc', size: 15 },
        path: [
          { x: 57, y: 27 },
          { x: 61, y: 50 },
          { x: 65, y: 27 },
          { x: 69, y: 50 },
          { x: 73, y: 28 },
        ],
        trail: 'band',
        slipNote:
          'Băng bị lệch ra ngoài ngón tay rồi. Cầm lại cuộn băng và quấn sát theo đường chấm nhé.',
        doneNote: 'Băng vừa kín vết cắt mà không quá chặt. Khéo lắm!',
        realityNote:
          'Ngoài đời, vết cắt nhỏ chỉ cần băng cá nhân hoặc gạc sạch. Quấn vừa đủ kín, không siết đến mức ngón tay tím hay tê.',
      },
    ],
  },

  outcomes: {
    success:
      'Máu đã cầm. Vết cắt được rửa sạch và dán băng cá nhân gọn gàng. Cô quản lý ghé xem, khen cả phòng xử lý rất bình tĩnh. Mai cười: “Lần sau để tớ rửa xoài thôi nhé!”',
    'partial-success':
      'Vết cắt của Mai đã được băng lại. Bạn đã giúp được Mai, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Cô quản lý ký túc xá đến và băng lại vết cắt cho Mai. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Bạn cùng phòng kịp ngăn lại và gọi cô quản lý. Những cách làm vừa rồi có thể khiến vết cắt của Mai bị nhiễm trùng.',
    timeout:
      'Hết giờ! Cô quản lý đã đến chăm sóc vết cắt cho Mai. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe:
      'Chạm vào từng dấu “?” trên hình. Khi đã xem hết những điểm quan trọng, bạn mới kết luận được.',
    assess:
      'Vết cắt nhỏ, nông, máu rỉ chậm và Mai vẫn tỉnh táo: hãy chọn “Nghi ngờ Mai bị đứt tay nhẹ, vết cắt nông”.',
    choose:
      'Thứ tự đúng: cất dao và rửa sạch tay → ép gạc sạch lên vết cắt → nhờ báo cô quản lý ký túc xá → khi máu đã cầm thì rửa vết cắt và băng lại.',
    act: 'Bước 1: nhấn và giữ nút “Ép chặt miếng gạc” cho đến khi thanh đầy, đừng thả tay giữa chừng. Bước 2: giữ cuộn băng rồi kéo theo đường chấm, lượn qua lại trên ngón tay cho đến vòng tròn.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-dormitory-01',
    title: 'Đứt tay, vết cắt nhỏ',
    levelId: 'dormitory-01',
    areaId: 'dormitory',
    signs: [
      'Vết cắt nông, mép gọn, máu rỉ ra chậm',
      'Đau rát tại chỗ',
      'Nạn nhân tỉnh táo, cử động ngón tay bình thường',
    ],
    principles: [
      'Cất vật sắc nhọn; rửa sạch tay hoặc đeo găng trước khi chạm vào vết thương',
      'Ép trực tiếp lên vết cắt bằng gạc hoặc vải sạch, giữ liên tục khoảng 10 phút',
      'Nếu máu thấm ướt gạc, đặt thêm gạc lên trên, không gỡ lớp cũ',
      'Khi máu đã cầm, rửa vết cắt nhỏ dưới vòi nước sạch',
      'Che vết thương bằng băng cá nhân hoặc gạc sạch',
      'Theo dõi những ngày sau: sưng, nóng, đỏ, có mủ là dấu hiệu nhiễm trùng',
    ],
    donts: [
      'Không bôi kem đánh răng, bột cà phê, thuốc lào hay lá cây lên vết thương',
      'Không nhấc gạc lên liên tục để xem máu đã cầm chưa',
      'Không ngậm hay mút vết thương',
      'Không trì hoãn sơ cứu để làm nốt việc đang dở',
    ],
    callForHelp: [
      'Máu phun thành tia hoặc chảy ồ ạt: gọi 115 ngay',
      'Máu không cầm sau khoảng 10 phút ép liên tục',
      'Vết cắt sâu, dài, hở miệng hoặc có dị vật bên trong',
      'Ngón tay bị tê hoặc không cử động được bình thường',
      'Vết thương do vật bẩn, gỉ sét, hoặc nạn nhân chưa tiêm phòng uốn ván đầy đủ',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
