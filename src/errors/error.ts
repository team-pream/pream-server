export const ERROR_RESPONSE = {
  INVALID_REFRESH_TOKEN: {
    errorCode: -824,
    title: '로그인 만료',
    description:
      '로그인 시간이 지나서 다시 로그인이 필요해요.\n로그인 해 주세요.',
  },
  INVALID_ACCESS_TOKEN: {
    errorCode: -825,
  },
  NO_AUTHORIZATION_HEADER: {
    errorCode: -954,
  },

  DUPLICATED_NICKNAME: {
    errorCode: -834,
    title: '닉네임 중복',
    description: '이미 사용 중인 닉네임이에요.\n새로운 닉네임을 입력해 주세요.',
  },
  INVALID_INPUT: {
    errorCode: -835,
    title: '입력 오류',
    description:
      '입력한 정보가 올바르지 않아요.\n입력 형식을 다시 확인해 주세요.',
  },
  INVALID_USER: {
    errorCode: -836,
    title: '계정 오류',
    description: '현재 로그인 상태가 유효하지 않아요.\n다시 로그인해 주세요.',
  },
  DUPLICATED_EMAIL: {
    errorCode: -837,
    title: '이메일 중복',
    description:
      '이미 다른 계정에 사용 중인 이메일이에요.\n다른 이메일을 입력해 주세요.',
  },
  DUPLICATED_PHONE: {
    errorCode: -838,
    title: '전화번호 중복',
    description:
      '이미 다른 계정에 사용 중인 번호예요.\n다른 번호를 입력해 주세요.',
  },
  PET_ALREADY_EXIST_ONBOARDING: {
    errorCode: -839,
    title: '반려동물 중복',
    description:
      '이미 등록된 반려동물 정보가 있어요.\n추가 등록은 필요하지 않습니다.',
  },
  PROFILE_EDIT_FAILED: {
    errorCode: -840,
    title: '수정 실패',
    description:
      '프로필을 수정하는 중 문제가 발생했어요.\n잠시 후 다시 시도해 주세요.',
  },
  NO_PET_EXIST: {
    errorCode: -841,
    title: '반려동물 정보 없음',
    description: '수정하려면 먼저 반려동물 정보를 등록해 주세요.',
  },
  PET_ALREADY_EXISTS: {
    errorCode: -842,
    title: '반려동물 중복 등록',
    description: '이미 등록된 반려동물 정보가 있어요. ',
  },
  PET_REQUIRED_FIELD_MISSING: {
    errorCode: -843,
    title: '정보 부족',
    description: '반려동물 등록 시 필요한 정보를 모두 입력해 주세요.',
  },
  PET_DOES_NOT_EXIST: {
    errorCode: -844,
    title: '반려동물 정보 없음',
    description: '등록된 반려동물 정보가 없어 삭제할 수 없어요.',
  },

  ADDRESS_REQUIRED_FIELD_MISSING: {
    errorCode: -845,
    title: '주소 정보 누락',
    description: '주소 등록 시 필요한 정보를 모두 입력해 주세요.',
  },

  /* Product */
  INVALID_PRODUCT_ID: {
    errorCode: -855,
    title: '상품 없음',
    description: '존재하지 않는 상품이에요.\n상품 정보를 다시 확인해 주세요.',
  },
  NO_PERMISSION_TO_DELETE_PRODUCT: {
    errorCode: -856,
    title: '삭제 권한 없음',
    description: '이 상품을 삭제할 권한이 없어요.',
  },
  PRODUCT_DELETE_FAILED: {
    errorCode: -857,
    title: '삭제 실패',
    description: '상품 삭제 중 문제가 발생했어요.\n잠시 후 다시 시도해 주세요.',
  },

  /* Order */
  ORDER_REQUIRED_FIELD_MISSING: {
    errorCode: -910,
    title: '주문 정보 누락',
    description: '주문 정보를 모두 입력해 주세요.',
  },
  INVALID_ORDER_PRODUCT_ID: {
    errorCode: -911,
    title: '상품 정보 없음',
    description: '존재하지 않는 상품이에요.\n상품 정보를 다시 확인해 주세요.',
  },

  /* Payment */
  INVALID_ORDER_ID: {
    errorCode: -920,
    title: '주문 정보 없음',
    description:
      '존재하지 않는 주문 정보에요.\n주문 정보를 다시 확인해 주세요.',
  },
  INVALID_PAYMENT_AMOUNT: {
    errorCode: -921,
    title: '결제 금액 오류',
    description:
      '결제 금액이 올바르지 않아요.\n결제 금액을 다시 확인해 주세요.',
  },
  NO_PERMISSION_TO_CANCEL_ORDER: {
    errorCode: -922,
    title: '취소 권한 없음',
    description: '주문을 취소할 권한이 없어요.',
  },
  CANCEL_AVAILABLE_PERIOD_EXPIRED: {
    errorCode: -923,
    title: '취소 기간 경과',
    description: '주문 취소 기간이 지나 취소할 수 없어요.',
  },
} as const;
