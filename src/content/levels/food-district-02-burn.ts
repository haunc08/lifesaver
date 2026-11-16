import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'food-district-02',
  areaId: 'food-district',
  title: 'Ấm nước sau quầy',
  scene: 'Quán cà phê',
  timeLimitSec: 100,

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Quán cà phê giờ này đông khách ghê. Chị Lan pha chế nhanh thoăn thoắt!',
      mood: 'happy',
    },
    { text: 'Chị Lan nhấc ấm nước sôi thì trượt tay. Nước nóng đổ lên mu bàn tay trái của chị.' },
    { speaker: 'Chị Lan', text: 'Á, nóng quá! Rát quá em ơi!', mood: 'pain' },
    {
      speaker: GUIDE_NAME,
      text: 'Bình tĩnh nào. Nhìn kỹ xem chuyện gì đã xảy ra nhé!',
      mood: 'worried',
    },
  ],

  observe: {
    required: 3,
    clues: [
      {
        id: 'hand',
        label: 'Bàn tay',
        caption:
          'Mu bàn tay trái của chị Lan đỏ ửng và rát. Vùng đỏ nhỏ hơn lòng bàn tay chị, chưa thấy phồng rộp.',
        x: 69,
        y: 43,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Chị Lan tỉnh táo, nhăn mặt vì đau rát.',
        x: 46,
        y: 36,
      },
      {
        id: 'ring',
        label: 'Nhẫn và đồng hồ',
        caption: 'Chị đeo nhẫn và đồng hồ ở đúng bên tay bị bỏng. Tay bỏng có thể sưng lên.',
        x: 57,
        y: 54,
      },
      {
        id: 'kettle',
        label: 'Ấm nước',
        caption: 'Ấm nước sôi đổ nghiêng trên quầy, nước nóng còn loang ra. Bếp vẫn đang bật.',
        x: 86,
        y: 50,
      },
      {
        id: 'sink',
        label: 'Bồn rửa',
        caption: 'Ngay sau quầy có bồn rửa với vòi nước sạch, mát.',
        x: 13,
        y: 55,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với chị Lan?',
    options: [
      {
        id: 'nothing',
        text: 'Chỉ hơi nóng một chút, không cần làm gì',
        correct: false,
        feedback: 'Da đỏ ửng và rát sau khi dính nước sôi là bỏng, cần làm mát ngay.',
      },
      {
        id: 'cut',
        text: 'Nghi ngờ chị Lan bị đứt tay',
        correct: false,
        feedback: 'Tay chị Lan không chảy máu, chỉ đỏ và rát sau khi dính nước sôi.',
      },
      {
        id: 'burn',
        text: 'Nghi ngờ chị Lan bị bỏng nước sôi ở bàn tay',
        correct: true,
        feedback: 'Đúng rồi: nước sôi đổ lên tay, da đỏ ửng và rát là dấu hiệu gợi ý bỏng.',
      },
      {
        id: 'shock',
        text: 'Nghi ngờ chị Lan bị điện giật',
        correct: false,
        feedback: 'Chị Lan bị nước sôi đổ vào tay, không chạm vào nguồn điện nào.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'cool', 'ring', 'call'],
    options: [
      {
        id: 'toothpaste',
        text: 'Bôi kem đánh răng hoặc nước mắm lên chỗ bỏng',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Kem đánh răng, nước mắm giữ nhiệt lại trong da và dễ gây nhiễm trùng.',
      },
      {
        id: 'ring',
        text: 'Nhẹ nhàng tháo nhẫn và đồng hồ trước khi tay sưng',
        kind: 'correct',
        feedback: 'Tay bỏng sẽ sưng lên. Tháo sớm để nhẫn, đồng hồ không thắt chặt vào tay.',
      },
      {
        id: 'call',
        text: 'Gọi quản lý quán đến hỗ trợ; sẵn sàng gọi 115 nếu vết bỏng rộng hoặc phồng rộp nhiều',
        kind: 'correct',
        mandatory: true,
        feedback: 'Có thêm người giúp, chị Lan sẽ được theo dõi và đưa đi khám khi cần.',
      },
      {
        id: 'dip',
        text: 'Nhúng tay vào chậu nước mát một lát cho đỡ rát',
        kind: 'partial',
        substitutes: 'cool',
        feedback: 'Làm mát là đúng, nhưng nên để dưới vòi nước chảy và giữ đủ lâu, khoảng 20 phút.',
      },
      {
        id: 'safe',
        text: 'Tắt bếp, dời ấm nước sôi ra xa, tránh vũng nước nóng',
        kind: 'correct',
        mandatory: true,
        feedback: 'Dẹp nguồn nóng trước để không ai bị bỏng thêm.',
      },
      {
        id: 'serve',
        text: 'Lau quầy và pha lại ly nước cho khách trước',
        kind: 'irrelevant',
        feedback: 'Khách chờ thêm một chút cũng được. Vết bỏng cần được làm mát ngay.',
      },
      {
        id: 'ice',
        text: 'Áp thẳng viên đá lạnh lên vết bỏng',
        kind: 'unsafe',
        feedback: 'Không an toàn! Đá lạnh áp trực tiếp có thể làm da tổn thương nặng thêm.',
      },
      {
        id: 'cool',
        text: 'Đưa tay chị Lan dưới vòi nước mát, sạch và giữ khoảng 20 phút',
        kind: 'correct',
        feedback: 'Nước mát chảy liên tục lấy bớt nhiệt khỏi da, giúp giảm đau và giảm tổn thương.',
      },
    ],
  },

  act: {
    type: 'hold',
    instruction: 'Giữ bàn tay chị Lan dưới vòi nước mát. Đừng rút tay ra sớm!',
    action: 'Giữ tay dưới vòi nước',
    holdSec: 7,
    holdingText: 'Nước mát đang làm dịu vết bỏng… giữ tiếp nào.',
    releaseText: 'Chưa đủ đâu! Rút tay ra sớm thì hơi nóng vẫn còn làm tổn thương da.',
    realityNote:
      'Ngoài đời, cần làm mát vết bỏng dưới vòi nước sạch khoảng 20 phút, càng sớm càng tốt.',
  },

  outcomes: {
    success:
      'Tay chị Lan dịu hẳn. Anh quản lý lấy màng bọc thực phẩm sạch che lỏng vết bỏng rồi đưa chị đi khám. Chị cảm ơn bạn đã nhanh tay và làm đúng.',
    'partial-success':
      'Tay chị Lan đỡ rát và chị được anh quản lý đưa đi khám. Bạn đã giúp được chị, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Anh quản lý chạy đến, đưa tay chị Lan dưới vòi nước rồi đưa chị đi khám. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Anh quản lý kịp ngăn lại và đưa tay chị Lan dưới vòi nước mát. Những cách làm vừa rồi có thể khiến vết bỏng nặng hơn.',
    timeout:
      'Hết giờ! Anh quản lý đã đến giúp chị Lan làm mát vết bỏng. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra sau quầy.',
    observe: 'Chạm vào các điểm sáng trên hình. Cần xem ít nhất 3 manh mối trước khi kết luận.',
    assess:
      'Nước sôi đổ lên tay, da đỏ ửng và rát, không chảy máu: hãy chọn “Nghi ngờ chị Lan bị bỏng nước sôi ở bàn tay”.',
    choose:
      'Thứ tự đúng: tắt bếp và dời ấm nước → đưa tay dưới vòi nước mát khoảng 20 phút → tháo nhẫn và đồng hồ → gọi quản lý quán đến hỗ trợ.',
    act: 'Nhấn giữ nút “Giữ tay dưới vòi nước” cho đến khi thanh đầy. Đừng thả tay giữa chừng.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-food-district-02',
    title: 'Bỏng nước sôi',
    levelId: 'food-district-02',
    areaId: 'food-district',
    signs: [
      'Da đỏ, nóng rát sau khi tiếp xúc với nước sôi, hơi nóng hoặc vật nóng',
      'Sưng, phồng rộp ở vùng bị bỏng',
      'Bỏng sâu: da trắng bệch hoặc cháy sém, có khi ít đau',
    ],
    principles: [
      'Tách nạn nhân khỏi nguồn nóng và dẹp nguồn nóng để không ai bị bỏng thêm',
      'Làm mát vết bỏng dưới vòi nước sạch, mát khoảng 20 phút, càng sớm càng tốt',
      'Nhẹ nhàng tháo nhẫn, đồng hồ, vòng tay trước khi vùng bỏng sưng lên',
      'Sau khi làm mát, che lỏng vết bỏng bằng màng bọc thực phẩm sạch hoặc gạc không dính',
      'Giữ ấm cho phần cơ thể còn lại và theo dõi nạn nhân',
    ],
    donts: [
      'Không áp đá lạnh trực tiếp lên vết bỏng',
      'Không bôi kem đánh răng, nước mắm, mỡ, bơ hay bất cứ thứ gì lạ',
      'Không chọc vỡ bóng nước',
      'Không cố gỡ quần áo đã dính vào vết bỏng',
    ],
    callForHelp: [
      'Vết bỏng rộng hơn lòng bàn tay của nạn nhân',
      'Bỏng ở mặt, bàn tay, bàn chân, khớp hoặc vùng kín',
      'Bỏng sâu, phồng rộp nhiều, da trắng bệch hoặc cháy sém',
      'Bỏng do điện, hóa chất, hoặc nạn nhân là trẻ nhỏ, người lớn tuổi',
      'Nạn nhân khó thở, lơ mơ hoặc đau không giảm sau khi làm mát',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
