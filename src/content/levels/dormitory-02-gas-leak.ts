import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The safety guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'dormitory-02',
  areaId: 'dormitory',
  title: 'Mùi lạ trong bếp chung',
  scene: 'Bếp chung',
  timeLimitSec: 100,

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Tối rồi, mình xuống bếp chung nấu mì nhé. Ơ… mùi gì lạ thế nhỉ?',
      mood: 'surprised',
    },
    { text: 'Bếp chung tối om, cửa đóng kín. Có tiếng xì xì nho nhỏ phát ra từ phía bếp gas.' },
    {
      speaker: 'Khoa',
      text: 'Tớ vào lấy nước nãy giờ, tự nhiên thấy chóng mặt với buồn nôn…',
      mood: 'worried',
    },
    { speaker: 'Tú', text: 'Tối quá! Để tớ bật đèn lên xem nào.', mood: 'neutral' },
    {
      speaker: GUIDE_NAME,
      text: 'Khoan! Đừng chạm vào công tắc. Quan sát kỹ đã!',
      mood: 'surprised',
    },
  ],

  observe: {
    required: 3,
    clues: [
      {
        id: 'stove',
        label: 'Bếp gas',
        caption: 'Một núm vặn của bếp đang mở nhưng không có lửa. Tiếng xì xì phát ra từ đây.',
        x: 22,
        y: 45,
      },
      {
        id: 'cylinder',
        label: 'Bình gas',
        caption: 'Bình gas đặt dưới gầm bếp. Van khóa nằm ngay trên đầu bình, dễ với tới.',
        x: 7,
        y: 80,
      },
      {
        id: 'window',
        label: 'Cửa sổ',
        caption: 'Cửa sổ và cửa ra vào đều đóng kín. Mùi nồng quẩn lại trong phòng.',
        x: 40,
        y: 14,
      },
      {
        id: 'khoa',
        label: 'Bạn Khoa',
        caption: 'Khoa chóng mặt, buồn nôn nhưng vẫn tỉnh và tự đi lại được.',
        x: 65,
        y: 40,
      },
      {
        id: 'switch',
        label: 'Công tắc đèn',
        caption:
          'Công tắc đèn nằm ngay cạnh cửa. Một tia lửa điện nhỏ cũng đủ gây cháy nổ khi có gas.',
        x: 80,
        y: 61,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra trong bếp?',
    options: [
      {
        id: 'food',
        text: 'Nghi ngờ Khoa bị ngộ độc thức ăn',
        correct: false,
        feedback: 'Khoa chưa ăn gì ở đây. Bạn ấy chóng mặt sau khi ở trong căn bếp kín có mùi lạ.',
      },
      {
        id: 'trash',
        text: 'Chỉ là mùi rác để lâu ngày',
        correct: false,
        feedback: 'Mùi rác không đi kèm tiếng xì xì từ bếp gas, cũng không làm người ta chóng mặt.',
      },
      {
        id: 'gas',
        text: 'Nghi ngờ bếp bị rò rỉ khí gas',
        correct: true,
        feedback:
          'Đúng rồi: mùi nồng lạ, tiếng xì xì, núm bếp mở mà không có lửa và người chóng mặt là các dấu hiệu gợi ý rò rỉ khí gas.',
      },
      {
        id: 'tired',
        text: 'Khoa thức khuya nên mệt thôi',
        correct: false,
        feedback: 'Mùi nồng và tiếng xì xì từ bếp cho thấy đây không chỉ là mệt mỏi.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['nospark', 'valve', 'vent', 'out'],
    options: [
      {
        id: 'vent',
        text: 'Mở toang cửa sổ và cửa ra vào cho thoáng khí',
        kind: 'correct',
        feedback: 'Mở hết cửa giúp khí gas thoát ra ngoài nhanh hơn.',
      },
      {
        id: 'light',
        text: 'Bật đèn và quạt hút mùi cho sáng, cho bay bớt gas',
        kind: 'unsafe',
        feedback: 'Không an toàn! Tia lửa điện khi bật công tắc có thể gây cháy nổ.',
      },
      {
        id: 'out',
        text: 'Đưa Khoa và mọi người ra ngoài, rồi gọi cô quản lý và 114 từ bên ngoài',
        kind: 'correct',
        mandatory: true,
        feedback: 'Ra nơi thoáng khí rồi mới gọi điện, để người có chuyên môn đến xử lý.',
      },
      {
        id: 'wipe',
        text: 'Lấy khăn lau lại mặt bếp cho sạch',
        kind: 'irrelevant',
        feedback: 'Việc này không giúp gì lúc này. Cần xử lý khí gas trước.',
      },
      {
        id: 'nospark',
        text: 'Ngăn mọi người bật đèn, bật bếp hay dùng điện thoại trong bếp',
        kind: 'correct',
        mandatory: true,
        feedback: 'Khi có mùi gas, việc đầu tiên là không để phát sinh tia lửa.',
      },
      {
        id: 'crack',
        text: 'Hé cửa sổ một chút cho bớt mùi',
        kind: 'partial',
        substitutes: 'vent',
        feedback: 'Mở cửa là đúng, nhưng phải mở toang tất cả các cửa thì khí gas mới thoát nhanh.',
      },
      {
        id: 'lighter',
        text: 'Bật bật lửa soi xem gas rò ở chỗ nào',
        kind: 'unsafe',
        feedback: 'Không an toàn! Ngọn lửa gặp khí gas có thể gây cháy nổ ngay lập tức.',
      },
      {
        id: 'valve',
        text: 'Khóa van bình gas, vì van ở ngay trong tầm tay',
        kind: 'correct',
        feedback: 'Khóa van là chặn nguồn gas. Chỉ làm khi van ở gần và an toàn để với tới.',
      },
    ],
  },

  act: {
    type: 'scan',
    instruction: 'Phòng đang đầy khí gas. Tìm và chạm vào tất cả những thứ có thể gây cháy nổ.',
    spots: [
      {
        id: 'window',
        label: 'Cửa sổ',
        x: 40,
        y: 13,
        hazard: false,
        note: 'Không nguy hiểm. Mở cửa sổ giúp khí gas thoát ra ngoài.',
      },
      {
        id: 'switch',
        label: 'Công tắc đèn',
        x: 80,
        y: 62,
        hazard: true,
        note: 'Nguy hiểm! Bật hay tắt công tắc đều có thể tạo ra tia lửa điện.',
      },
      {
        id: 'shelf',
        label: 'Kệ bát đĩa',
        x: 15,
        y: 17,
        hazard: false,
        note: 'Không nguy hiểm. Bát đĩa không tạo ra tia lửa.',
      },
      {
        id: 'lighter',
        label: 'Bật lửa',
        x: 43,
        y: 42,
        hazard: true,
        note: 'Nguy hiểm! Tuyệt đối không tạo ra ngọn lửa khi có mùi gas.',
      },
      {
        id: 'knob',
        label: 'Núm bếp đang mở',
        x: 24,
        y: 57,
        hazard: true,
        note: 'Nguy hiểm! Núm bếp mở mà không có lửa là nơi gas đang thoát ra.',
      },
      {
        id: 'door',
        label: 'Cửa ra vào',
        x: 84,
        y: 82,
        hazard: false,
        note: 'Không nguy hiểm. Mở rộng cửa để thoáng khí và làm lối ra ngoài.',
      },
      {
        id: 'phone',
        label: 'Điện thoại reo',
        x: 50,
        y: 84,
        hazard: true,
        note: 'Nguy hiểm! Không nghe hay gọi điện thoại trong phòng có gas. Ra ngoài rồi mới gọi.',
      },
    ],
  },

  outcomes: {
    success:
      'Van gas đã khóa, các cửa mở toang, mọi người ra sân an toàn. Cô quản lý và đội kỹ thuật đến kiểm tra bếp. Hít thở khí trời một lúc, Khoa hết chóng mặt hẳn.',
    'partial-success':
      'Mọi người đã ra ngoài an toàn và cô quản lý đang cho kiểm tra bếp. Bạn đã xử lý được sự cố, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Cô quản lý đến kịp, đưa mọi người ra ngoài và gọi đội kỹ thuật. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Tú kịp giữ tay bạn lại, và cô quản lý đến đưa mọi người ra ngoài. Những cách làm vừa rồi có thể tạo ra tia lửa và gây cháy nổ rất nguy hiểm.',
    timeout:
      'Hết giờ! Cô quản lý đã đến đưa mọi người ra ngoài. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe: 'Chạm vào các điểm sáng trên hình. Cần xem ít nhất 3 manh mối trước khi kết luận.',
    assess:
      'Mùi nồng lạ, tiếng xì xì, núm bếp mở mà không có lửa, Khoa chóng mặt: hãy chọn “Nghi ngờ bếp bị rò rỉ khí gas”.',
    choose:
      'Thứ tự đúng: ngăn mọi người bật đèn, bật bếp, dùng điện thoại → khóa van bình gas → mở toang các cửa → đưa mọi người ra ngoài rồi gọi cô quản lý và 114.',
    act: 'Có bốn mối nguy: công tắc đèn, bật lửa, điện thoại đang reo và núm bếp đang mở. Cửa sổ, cửa ra vào và kệ bát đĩa thì không nguy hiểm.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-dormitory-02',
    title: 'Rò rỉ khí gas',
    levelId: 'dormitory-02',
    areaId: 'dormitory',
    signs: [
      'Mùi hôi nồng đặc trưng, giống mùi trứng thối hoặc tỏi',
      'Tiếng xì xì gần bếp, dây dẫn hoặc bình gas',
      'Núm bếp mở nhưng không có lửa',
      'Người trong phòng chóng mặt, nhức đầu, buồn nôn',
    ],
    principles: [
      'Không để phát sinh tia lửa: không bật tắt công tắc, thiết bị điện, không dùng lửa',
      'Khóa van bình gas nếu van ở trong tầm tay và an toàn để làm',
      'Mở hết cửa sổ, cửa ra vào để khí gas thoát ra',
      'Đưa mọi người ra khỏi khu vực, đến nơi thoáng khí',
      'Ra ngoài rồi mới gọi quản lý tòa nhà và 114',
      'Người bị chóng mặt cần được nghỉ ở nơi thoáng khí và có người theo dõi',
    ],
    donts: [
      'Không bật hay tắt đèn, quạt, bếp, ổ cắm điện',
      'Không dùng bật lửa, diêm hay nến để soi tìm chỗ rò',
      'Không nghe, gọi điện thoại trong khu vực có mùi gas',
      'Không quay lại phòng cho đến khi người có chuyên môn báo an toàn',
    ],
    callForHelp: [
      'Báo quản lý ký túc xá hoặc tòa nhà mỗi khi nghi ngờ rò rỉ gas',
      'Gọi 114 khi mùi gas nồng, không khóa được van hoặc có cháy',
      'Gọi 115 khi có người khó thở, lơ mơ, bất tỉnh hoặc nôn nhiều',
      'Chóng mặt, nhức đầu không hết sau khi đã ra nơi thoáng khí',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
