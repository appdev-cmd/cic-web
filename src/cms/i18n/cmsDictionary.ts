import type { CmsLocale } from '../data/CmsDataSource';

export interface CmsDictionary {
  dashboard: {
    pageTitle: string;
    pageDescription: string;
    customizeLayout: string;
    currentWork: string;
    currentWorkSubtitle: string;
    recentItems: string;
    noCurrentWork: string;
    draft: string;
    unread: string;
    processing: string;
    kpiProducts: string;
    kpiNews: string;
    kpiStaticPages: string;
    kpiEvents: string;
    kpiCustomerRequests: string;
    kpiActive: string;
    kpiPublished: string;
    kpiUpcoming: string;
    kpiActionRequired: string;
    kpiRequestsPending: string;
    customerRequests: string;
    customerRequestsSubtitle: string;
    pendingContent: string;
    pendingContentSubtitle: string;
    viewAll: string;
    activityCharts: string;
    activityChartsSubtitle: string;
    range7Days: string;
    range30Days: string;
    rangeThisMonth: string;
    rangeThisYear: string;
    systemPulse: string;
    systemPulseSubtitle: string;
    viewFullAudit: string;
    noDataEn: string;
    noDataEnDesc: string;
    customizerTitle: string;
    customizerSubtitle: string;
    customizerSave: string;
    customizerReset: string;
    densityComfortable: string;
    densityCompact: string;
  };
  header: {
    cmsSubtitle: string;
    searchPlaceholder: string;
    quickSearchShort: string;
    quickAction: string;
    newProduct: string;
    newNews: string;
    newService: string;
    newEvent: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
    viewWebsite: string;
    myAccount: string;
    changePassword: string;
    logout: string;
    roleSuperAdmin: string;
    roleAdmin: string;
    roleEditor: string;
    roleViewer: string;
  };
  sidebar: {
    filterPlaceholder: string;
    expandTitle: string;
    collapseTitle: string;
    systemStatusOnline: string;
    cmsFooterTitle: string;
  };
  menu: {
    groups: Record<string, string>;
    items: Record<string, string>;
  };
  common: {
    search: string;
    searchPlaceholder: string;
    reset: string;
    resetFilters: string;
    filter: string;
    all: string;
    allStatus: string;
    allCategories: string;
    status: string;
    draft: string;
    published: string;
    active: string;
    inactive: string;
    featured: string;
    home: string;
    actions: string;
    created: string;
    updated: string;
    author: string;
    category: string;
    viewCount: string;
    price: string;
    selectAll: string;
    publish: string;
    revertDraft: string;
    delete: string;
    edit: string;
    view: string;
    preview: string;
    save: string;
    saving: string;
    cancel: string;
    back: string;
    confirm: string;
    updatingList: string;
    noData: string;
    clearSearch: string;
    items: string;
    refresh: string;
  };
  modules: {
    news: {
      title: string;
      description: string;
      itemUnit: string;
      createButton: string;
      searchPlaceholder: string;
      allCategories: string;
      allStatus: string;
      draftStatus: string;
      publishedStatus: string;
      emptyText: string;
      columns: {
        articleAndAlerts: string;
        category: string;
        author: string;
        featured: string;
        home: string;
        status: string;
        publishedSchedule: string;
        updated: string;
        actions: string;
      };
      bulk: {
        itemLabel: string;
        publish: string;
        revertDraft: string;
        delete: string;
      };
    };
    newsCategories: {
      title: string;
      description: string;
      itemUnit: string;
      createButton: string;
      searchPlaceholder: string;
      emptyText: string;
      columns: {
        name: string;
        slug: string;
        articles: string;
        ordering: string;
        homepage: string;
        status: string;
        actions: string;
      };
    };
    products: {
      title: string;
      description: string;
      itemUnit: string;
      createButton: string;
      tabs: {
        all: string;
        published: string;
        draft: string;
        featured: string;
      };
      toolbar: {
        searchPlaceholder: string;
        clearSearch: string;
        allCategories: string;
        allBrands: string;
        allProductTypes: string;
        allApplications: string;
        resetFilters: string;
      };
      columns: {
        product: string;
        code: string;
        category: string;
        brand: string;
        productType: string;
        application: string;
        price: string;
        status: string;
        featured: string;
        views: string;
        updated: string;
        actions: string;
      };
      emptyText: string;
    };
    events: {
      title: string;
      description: string;
      itemUnit: string;
      createButton: string;
      searchPlaceholder: string;
      editorialAll: string;
      editorialDraft: string;
      editorialPublished: string;
      progressAll: string;
      progressUpcoming: string;
      progressOngoing: string;
      progressEnded: string;
      columns: {
        title: string;
        time: string;
        place: string;
        status: string;
        progress: string;
        actions: string;
      };
      emptyText: string;
    };
    services: {
      title: string;
      description: string;
      itemUnit: string;
      createButton: string;
      searchPlaceholder: string;
      statusAll: string;
      statusDraft: string;
      statusPublished: string;
      columns: {
        service: string;
        status: string;
        updated: string;
        actions: string;
      };
      emptyText: string;
    };
    projects: {
      title: string;
      description: string;
      itemUnit: string;
      createButton: string;
      searchPlaceholder: string;
      columns: {
        project: string;
        category: string;
        status: string;
        updated: string;
        actions: string;
      };
      emptyText: string;
    };
    staticPages: {
      title: string;
      description: string;
      itemUnit: string;
      createButton: string;
      refreshButton: string;
      emptyText: string;
    };
    productTaxonomies: {
      categories: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        statusActive: string;
        statusInactive: string;
        bulkDeactivate: string;
        columns: {
          nameAndCode: string;
          ordering: string;
          status: string;
          actions: string;
        };
        emptyText: string;
      };
      brands: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        statusActive: string;
        statusInactive: string;
        bulkDeactivate: string;
        columns: {
          nameAndSlug: string;
          ordering: string;
          status: string;
          actions: string;
        };
        emptyText: string;
      };
      applications: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        statusActive: string;
        statusInactive: string;
        bulkDeactivate: string;
        columns: {
          nameAndSlug: string;
          ordering: string;
          status: string;
          actions: string;
        };
        emptyText: string;
      };
      types: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        statusActive: string;
        statusInactive: string;
        bulkDeactivate: string;
        columns: {
          nameAndSlug: string;
          ordering: string;
          status: string;
          actions: string;
        };
        emptyText: string;
      };
      salesStaff: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        statusActive: string;
        statusInactive: string;
        columns: {
          fullName: string;
          emailPhone: string;
          assignedProducts: string;
          ordering: string;
          status: string;
          actions: string;
        };
        emptyText: string;
      };
    };
    customerEngagement: {
      requests: {
        title: string;
        description: string;
        itemUnit: string;
        tabs: {
          all: string;
          new: string;
          processing: string;
          completed: string;
          notSuitable: string;
          cancelled: string;
        };
        searchPlaceholder: string;
        emptyText: string;
      };
      forms: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        emptyText: string;
      };
      cta: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        emptyText: string;
      };
      emailTemplates: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        eventAll: string;
        audienceAll: string;
        statusAll: string;
        emptyText: string;
      };
    };
    system: {
      users: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        searchPlaceholder: string;
        statusAll: string;
        roleAll: string;
        agencyAll: string;
        emptyText: string;
      };
      permissions: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        emptyText: string;
      };
      settings: {
        title: string;
        description: string;
      };
      seo: {
        title: string;
        description: string;
        itemUnit: string;
        createButton: string;
        tabs: {
          overview: string;
          templates: string;
          redirects: string;
        };
      };
      menu: {
        title: string;
        description: string;
        createButton: string;
      };
      media: {
        title: string;
        description: string;
        itemUnit: string;
        uploadButton: string;
        albumsButton: string;
        searchPlaceholder: string;
        emptyText: string;
      };
      logs: {
        title: string;
        description: string;
        itemUnit: string;
        searchPlaceholder: string;
      };
      trash: {
        title: string;
        description: string;
        itemUnit: string;
        searchPlaceholder: string;
      };
    };
  };
}

export const viCmsDictionary: CmsDictionary = {
  dashboard: {
    pageTitle: 'Tổng quan vận hành',
    pageDescription: 'Trung tâm giám sát thông số thời gian thực, tiếp nhận yêu cầu tư vấn và theo dõi nhật ký hoạt động CIC Technology',
    customizeLayout: 'Tùy chỉnh giao diện',
    currentWork: 'Công việc hiện tại',
    currentWorkSubtitle: 'Bản nháp và yêu cầu khách hàng cần tiếp tục xử lý',
    recentItems: 'việc gần nhất',
    noCurrentWork: 'Hiện không có công việc nào cần tiếp tục xử lý.',
    draft: 'Bản nháp',
    unread: 'Chưa đọc',
    processing: 'Đang xử lý',
    kpiProducts: 'Sản phẩm',
    kpiNews: 'Tin tức',
    kpiStaticPages: 'Trang nội dung',
    kpiEvents: 'Sự kiện',
    kpiCustomerRequests: 'Yêu cầu khách hàng',
    kpiActive: 'Đang hoạt động',
    kpiPublished: 'Đã xuất bản',
    kpiUpcoming: 'Sắp diễn ra',
    kpiActionRequired: 'Chưa xử lý!',
    kpiRequestsPending: 'Yêu cầu đang chờ xử lý',
    customerRequests: 'Yêu cầu khách hàng',
    customerRequestsSubtitle: 'Các yêu cầu mới nhất cần tiếp nhận và xử lý',
    pendingContent: 'Nội dung chờ duyệt',
    pendingContentSubtitle: 'Các bản ghi ở trạng thái nháp cần xuất bản',
    viewAll: 'Xem tất cả',
    activityCharts: 'Biểu đồ hoạt động và tiếp nhận yêu cầu',
    activityChartsSubtitle: 'Theo dõi xu hướng tương tác và xuất bản nội dung',
    range7Days: '7 ngày',
    range30Days: '30 ngày',
    rangeThisMonth: 'Tháng này',
    rangeThisYear: 'Năm nay',
    systemPulse: 'Nhật ký hệ thống gần đây',
    systemPulseSubtitle: 'Lịch sử thao tác của quản trị viên',
    viewFullAudit: 'Xem đầy đủ nhật ký',
    noDataEn: 'Chưa có dữ liệu Dashboard cho English',
    noDataEnDesc: 'Workspace EN là dataset độc lập và không sử dụng dữ liệu VI để thay thế.',
    customizerTitle: 'Tùy chỉnh Bảng điều khiển',
    customizerSubtitle: 'Cá nhân hóa Widget, mật độ hiển thị & phạm vi',
    customizerSave: 'Lưu thay đổi',
    customizerReset: 'Khôi phục mặc định',
    densityComfortable: 'Thoải mái',
    densityCompact: 'Thu gọn',
  },
  header: {
    cmsSubtitle: 'Hệ thống Quản trị Nội dung',
    searchPlaceholder: 'Tìm kiếm toàn bộ CMS (sản phẩm, tin tức, leads...)',
    quickSearchShort: 'Tìm kiếm CMS...',
    quickAction: 'Tạo mới',
    newProduct: 'Sản phẩm mới',
    newNews: 'Tin tức mới',
    newService: 'Dịch vụ mới',
    newEvent: 'Sự kiện mới',
    notifications: 'Thông báo hệ thống',
    markAllRead: 'Đánh dấu đã đọc',
    noNotifications: 'Chưa có thông báo.',
    viewWebsite: 'Xem trang web',
    myAccount: 'Tài khoản của tôi',
    changePassword: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    roleSuperAdmin: 'Quản trị viên cấp cao',
    roleAdmin: 'Quản trị viên',
    roleEditor: 'Biên tập viên',
    roleViewer: 'Người xem',
  },
  sidebar: {
    filterPlaceholder: 'Lọc menu...',
    expandTitle: 'Mở rộng sidebar (248px)',
    collapseTitle: 'Thu gọn sidebar (72px)',
    systemStatusOnline: 'Trạng thái hệ thống online',
    cmsFooterTitle: 'Hệ thống quản trị nội dung',
  },
  menu: {
    groups: {
      grp_tong_quan: 'TỔNG QUAN',
      grp_noi_dung: 'NỘI DUNG',
      grp_san_pham: 'SẢN PHẨM',
      grp_website: 'WEBSITE',
      grp_tuong_tac_khach_hang: 'TƯƠNG TÁC KHÁCH HÀNG',
      grp_khach_hang: 'TƯƠNG TÁC KHÁCH HÀNG',
      grp_quan_tri_he_thong: 'QUẢN TRỊ HỆ THỐNG',
      grp_he_thong: 'HỆ THỐNG',
    },
    items: {
      menu_dashboard: 'Tổng quan',
      menu_news: 'Tin tức',
      menu_news_categories: 'Danh mục tin tức',
      menu_static_pages: 'Trang nội dung',
      menu_events: 'Sự kiện',
      menu_projects: 'Dự án',
      menu_services: 'Dịch vụ',
      menu_products_group: 'Sản phẩm',
      menu_product_categories: 'Danh mục sản phẩm',
      menu_product_brands: 'Hãng sản xuất',
      menu_product_applications: 'Lĩnh vực ứng dụng',
      menu_product_types: 'Loại sản phẩm',
      menu_product_sales_staff: 'Người phụ trách kinh doanh',
      menu_navigation: 'Menu',
      menu_media_library: 'Thư viện media',
      menu_media: 'Thư viện media',
      menu_cta: 'CTA',
      menu_forms: 'Biểu mẫu',
      menu_customer_requests: 'Yêu cầu khách hàng',
      menu_email_templates: 'Mẫu email',
      menu_users: 'Người dùng',
      menu_cic_users: 'Người dùng',
      menu_permissions: 'Vai trò & quyền',
      menu_permission_management: 'Vai trò & quyền',
      menu_system_settings: 'Cấu hình hệ thống',
      menu_system_config: 'Cấu hình hệ thống',
      menu_function_seo: 'SEO & URL',
      menu_translation_strings: 'Ngôn ngữ giao diện',
      menu_activity_logs: 'Nhật ký hoạt động',
      menu_trash: 'Thùng rác',
    },
  },
  common: {
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm kiếm...',
    reset: 'Đặt lại',
    resetFilters: 'Đặt lại bộ lọc',
    filter: 'Bộ lọc',
    all: 'Tất cả',
    allStatus: 'Tất cả trạng thái',
    allCategories: 'Tất cả danh mục',
    status: 'Trạng thái',
    draft: 'Bản nháp',
    published: 'Đã xuất bản',
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    featured: 'Nổi bật',
    home: 'Trang chủ',
    actions: 'Thao tác',
    created: 'Ngày tạo',
    updated: 'Cập nhật',
    author: 'Tác giả',
    category: 'Danh mục',
    viewCount: 'Lượt xem',
    price: 'Giá',
    selectAll: 'Chọn tất cả',
    publish: 'Xuất bản',
    revertDraft: 'Chuyển về nháp',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    view: 'Xem',
    preview: 'Xem trước',
    save: 'Lưu',
    saving: 'Đang lưu...',
    cancel: 'Hủy',
    back: 'Quay lại',
    confirm: 'Xác nhận',
    updatingList: 'Đang cập nhật danh sách...',
    noData: 'Không có dữ liệu',
    clearSearch: 'Xóa tìm kiếm',
    items: 'mục',
    refresh: 'Làm mới',
  },
  modules: {
    news: {
      title: 'Tin tức',
      description: 'Tạo, biên tập, lưu nháp và xuất bản bài viết công khai.',
      itemUnit: 'tin bài',
      createButton: 'Thêm tin tức',
      searchPlaceholder: 'Tìm kiếm theo tiêu đề, alias, từ khóa tag...',
      allCategories: '-- Tất cả Danh mục --',
      allStatus: '-- Tất cả trạng thái --',
      draftStatus: 'Bản nháp (Draft)',
      publishedStatus: 'Đã xuất bản (Published)',
      emptyText: 'Không tìm thấy bài viết tin tức nào.',
      columns: {
        articleAndAlerts: 'Bài viết & Cảnh báo',
        category: 'Danh mục',
        author: 'Tác giả',
        featured: 'Nổi bật',
        home: 'Trang chủ',
        status: 'Trạng thái',
        publishedSchedule: 'Xuất bản / Lịch',
        updated: 'Cập nhật',
        actions: 'Thao tác',
      },
      bulk: {
        itemLabel: 'bài viết',
        publish: 'Xuất bản',
        revertDraft: 'Chuyển về nháp',
        delete: 'Xóa',
      },
    },
    newsCategories: {
      title: 'Danh mục tin tức',
      description: 'Quản lý cấu trúc, hiển thị và SEO của các trang danh mục tin tức.',
      itemUnit: 'danh mục',
      createButton: 'Thêm danh mục',
      searchPlaceholder: 'Tìm theo tên hoặc đường dẫn...',
      emptyText: 'Không tìm thấy danh mục phù hợp.',
      columns: {
        name: 'Tên danh mục',
        slug: 'Đường dẫn',
        articles: 'Bài viết',
        ordering: 'Thứ tự',
        homepage: 'Trang chủ',
        status: 'Trạng thái',
        actions: 'Thao tác',
      },
    },
    products: {
      title: 'Sản phẩm',
      description: 'Quản lý danh mục sản phẩm, cấu hình giá, phân loại theo hãng, lĩnh vực, ứng dụng và trạng thái xuất bản.',
      itemUnit: 'sản phẩm',
      createButton: 'Thêm sản phẩm',
      tabs: {
        all: 'Tất cả sản phẩm',
        published: 'Đã xuất bản',
        draft: 'Bản nháp',
        featured: 'Sản phẩm tiêu biểu',
      },
      toolbar: {
        searchPlaceholder: 'Tìm theo Tên, SKU, Hãng...',
        clearSearch: 'Xóa tìm kiếm',
        allCategories: 'Tất cả Lĩnh vực',
        allBrands: 'Tất cả Hãng sản xuất',
        allProductTypes: 'Tất cả Loại sản phẩm',
        allApplications: 'Tất cả Ứng dụng',
        resetFilters: 'Đặt lại bộ lọc',
      },
      columns: {
        product: 'Sản phẩm',
        code: 'Biệt danh',
        category: 'Lĩnh vực',
        brand: 'Hãng sản xuất',
        productType: 'Loại sản phẩm',
        application: 'Ứng dụng',
        price: 'Giá',
        status: 'Trạng thái',
        featured: 'Nổi bật',
        views: 'Lượt xem',
        updated: 'Cập nhật',
        actions: 'Thao tác',
      },
      emptyText: 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc.',
    },
    events: {
      title: 'Sự kiện và hội thảo',
      description: 'Quản lý sự kiện, hội thảo chuyên đề, khóa đào tạo và chương trình trực tuyến.',
      itemUnit: 'sự kiện',
      createButton: 'Thêm sự kiện',
      searchPlaceholder: 'Tìm kiếm sự kiện theo tiêu đề...',
      editorialAll: 'Trạng thái: Tất cả',
      editorialDraft: 'Bản nháp',
      editorialPublished: 'Đã xuất bản',
      progressAll: 'Trạng thái diễn ra: Tất cả',
      progressUpcoming: 'Sắp diễn ra',
      progressOngoing: 'Đang diễn ra',
      progressEnded: 'Đã kết thúc',
      columns: {
        title: 'Tiêu đề sự kiện',
        time: 'Thời gian sự kiện',
        place: 'Địa điểm',
        status: 'Trạng thái',
        progress: 'Trạng thái diễn ra',
        actions: 'Thao tác',
      },
      emptyText: 'Không tìm thấy sự kiện phù hợp.',
    },
    services: {
      title: 'Dịch vụ',
      description: 'Quản lý nội dung, hình ảnh, SEO và trạng thái xuất bản dịch vụ.',
      itemUnit: 'dịch vụ',
      createButton: 'Thêm dịch vụ',
      searchPlaceholder: 'Tìm theo tên hoặc tóm tắt...',
      statusAll: 'Tất cả trạng thái nội dung',
      statusDraft: 'Bản nháp',
      statusPublished: 'Đã xuất bản',
      columns: {
        service: 'Dịch vụ',
        status: 'Trạng thái xuất bản',
        updated: 'Cập nhật',
        actions: 'Thao tác',
      },
      emptyText: 'Không tìm thấy dịch vụ phù hợp với điều kiện lọc.',
    },
    projects: {
      title: 'Dự án',
      description: 'Quản lý danh sách dự án tiêu biểu, giải pháp ứng dụng và công nghệ triển khai.',
      itemUnit: 'dự án',
      createButton: 'Thêm dự án',
      searchPlaceholder: 'Tìm theo tên dự án, khách hàng...',
      columns: {
        project: 'Dự án',
        category: 'Lĩnh vực',
        status: 'Trạng thái',
        updated: 'Cập nhật',
        actions: 'Thao tác',
      },
      emptyText: 'Không tìm thấy dự án nào phù hợp.',
    },
    staticPages: {
      title: 'Trang nội dung',
      description: 'Quản lý các trang thiết kế riêng và tạo trang mới theo mẫu nội dung chuẩn.',
      itemUnit: 'trang',
      createButton: 'Tạo trang nội dung',
      refreshButton: 'Làm mới',
      emptyText: 'Chưa có trang nội dung nào.',
    },
    productTaxonomies: {
      categories: {
        title: 'Danh mục sản phẩm',
        description: 'Quản lý danh mục theo ngành và sơ đồ điều hướng sản phẩm.',
        itemUnit: 'danh mục',
        createButton: 'Thêm danh mục sản phẩm',
        searchPlaceholder: 'Tìm theo tên, mã hoặc mô tả...',
        statusAll: 'Tất cả trạng thái',
        statusActive: 'Đang sử dụng',
        statusInactive: 'Ngừng sử dụng',
        bulkDeactivate: 'Ngừng sử dụng',
        columns: {
          nameAndCode: 'Tên và mã nhận diện',
          ordering: 'Thứ tự',
          status: 'Trạng thái',
          actions: 'Thao tác',
        },
        emptyText: 'Không tìm thấy danh mục phù hợp.',
      },
      brands: {
        title: 'Hãng sản xuất',
        description: 'Quản lý đối tác công nghệ, thương hiệu phần mềm và thiết bị.',
        itemUnit: 'hãng sản xuất',
        createButton: 'Thêm hãng sản xuất',
        searchPlaceholder: 'Tìm theo tên hoặc tên hiệu...',
        statusAll: 'Tất cả trạng thái',
        statusActive: 'Đang sử dụng',
        statusInactive: 'Ngừng sử dụng',
        bulkDeactivate: 'Ngừng sử dụng',
        columns: {
          nameAndSlug: 'Tên và tên hiệu',
          ordering: 'Thứ tự',
          status: 'Trạng thái',
          actions: 'Thao tác',
        },
        emptyText: 'Không tìm thấy hãng sản xuất phù hợp.',
      },
      applications: {
        title: 'Lĩnh vực ứng dụng',
        description: 'Quản lý danh sách ứng dụng thực tế theo chuyên ngành.',
        itemUnit: 'ứng dụng',
        createButton: 'Thêm lĩnh vực ứng dụng',
        searchPlaceholder: 'Tìm theo tên hoặc tên hiệu...',
        statusAll: 'Tất cả trạng thái',
        statusActive: 'Đang sử dụng',
        statusInactive: 'Ngừng sử dụng',
        bulkDeactivate: 'Ngừng sử dụng',
        columns: {
          nameAndSlug: 'Tên và tên hiệu',
          ordering: 'Thứ tự',
          status: 'Trạng thái',
          actions: 'Thao tác',
        },
        emptyText: 'Không tìm thấy lĩnh vực ứng dụng phù hợp.',
      },
      types: {
        title: 'Loại sản phẩm',
        description: 'Quản lý hình thức cấp phép và phân loại bản quyền.',
        itemUnit: 'loại sản phẩm',
        createButton: 'Thêm loại sản phẩm',
        searchPlaceholder: 'Tìm theo tên hoặc tên hiệu...',
        statusAll: 'Tất cả trạng thái',
        statusActive: 'Đang sử dụng',
        statusInactive: 'Ngừng sử dụng',
        bulkDeactivate: 'Ngừng sử dụng',
        columns: {
          nameAndSlug: 'Tên và tên hiệu',
          ordering: 'Thứ tự',
          status: 'Trạng thái',
          actions: 'Thao tác',
        },
        emptyText: 'Không tìm thấy loại sản phẩm phù hợp.',
      },
      salesStaff: {
        title: 'Người phụ trách kinh doanh',
        description: 'Quản lý thông tin liên hệ chuyên viên phụ trách sản phẩm.',
        itemUnit: 'nhân sự',
        createButton: 'Thêm nhân sự',
        searchPlaceholder: 'Tìm theo họ tên, email, điện thoại...',
        statusAll: 'Tất cả trạng thái',
        statusActive: 'Đang hoạt động',
        statusInactive: 'Tạm khóa',
        columns: {
          fullName: 'Họ và tên',
          emailPhone: 'Email & Số điện thoại',
          assignedProducts: 'Sản phẩm phụ trách',
          ordering: 'Thứ tự',
          status: 'Trạng thái',
          actions: 'Thao tác',
        },
        emptyText: 'Không tìm thấy nhân sự kinh doanh phù hợp.',
      },
    },
    customerEngagement: {
      requests: {
        title: 'Yêu cầu khách hàng',
        description: 'Tiếp nhận, phân loại và xử lý yêu cầu báo giá, tư vấn từ website.',
        itemUnit: 'yêu cầu',
        tabs: {
          all: 'Tất cả',
          new: 'Mới tiếp nhận',
          processing: 'Đang xử lý',
          completed: 'Hoàn thành',
          notSuitable: 'Không phù hợp',
          cancelled: 'Đã hủy',
        },
        searchPlaceholder: 'Tìm theo tên, email, số điện thoại, công ty...',
        emptyText: 'Không có yêu cầu khách hàng nào.',
      },
      forms: {
        title: 'Quản lý Biểu mẫu',
        description: 'Quản lý các biểu mẫu tiếp nhận thông tin và đăng ký trực tuyến.',
        itemUnit: 'biểu mẫu',
        createButton: 'Tạo biểu mẫu mới',
        searchPlaceholder: 'Tìm kiếm theo tên, mã, tiêu đề...',
        statusAll: 'Tất cả Trạng thái',
        emptyText: 'Không tìm thấy biểu mẫu phù hợp.',
      },
      cta: {
        title: 'Khối kêu gọi hành động (CTA)',
        description: 'Quản lý nội dung, nút bấm và điều hướng CTA trên toàn trang.',
        itemUnit: 'CTA',
        createButton: 'Thêm CTA',
        searchPlaceholder: 'Tìm theo tên nút, tiêu đề, mã...',
        statusAll: 'Tất cả trạng thái',
        emptyText: 'Không tìm thấy CTA phù hợp.',
      },
      emailTemplates: {
        title: 'Mẫu Email thông báo',
        description: 'Cấu hình nội dung thư tự động gửi tới khách hàng và quản trị viên.',
        itemUnit: 'mẫu thư',
        createButton: 'Thêm mẫu email',
        searchPlaceholder: 'Tìm theo tên, tiêu đề, mã mẫu...',
        eventAll: 'Tất cả sự kiện',
        audienceAll: 'Tất cả đối tượng',
        statusAll: 'Tất cả trạng thái',
        emptyText: 'Không tìm thấy mẫu email phù hợp.',
      },
    },
    system: {
      users: {
        title: 'Người dùng CMS',
        description: 'Quản lý tài khoản, hồ sơ, vai trò và trạng thái truy cập hệ thống.',
        itemUnit: 'tài khoản',
        createButton: 'Thêm người dùng',
        searchPlaceholder: 'Tìm kiếm theo tên, email, username...',
        statusAll: 'Tất cả trạng thái',
        roleAll: 'Tất cả vai trò',
        agencyAll: 'Tất cả chi nhánh',
        emptyText: 'Không tìm thấy người dùng phù hợp.',
      },
      permissions: {
        title: 'Vai trò và quyền',
        description: 'Quản lý vai trò và các thao tác được phép trong từng chức năng CMS.',
        itemUnit: 'vai trò hoạt động',
        createButton: 'Thêm vai trò',
        emptyText: 'Không tìm thấy vai trò phù hợp.',
      },
      settings: {
        title: 'Cấu hình hệ thống',
        description: 'Quản lý thông tin tổ chức, kênh liên hệ và cấu hình chung website.',
      },
      seo: {
        title: 'SEO & URL',
        description: 'Kiểm soát khả năng hiển thị trên công cụ tìm kiếm, template SEO và vòng đời URL của website.',
        itemUnit: 'module hệ thống',
        createButton: 'Thêm cấu hình SEO',
        tabs: {
          overview: 'Tổng quan sức khỏe',
          templates: 'Trang hệ thống & Mẫu SEO',
          redirects: 'Chuyển hướng (301/302) & Sitemap',
        },
      },
      menu: {
        title: 'Quản lý Menu điều hướng',
        description: 'Cấu trúc menu đa cấp theo nhóm vị trí Header, Footer và Sidebar.',
        createButton: 'Thêm menu',
      },
      media: {
        title: 'Thư viện tệp',
        description: 'Quản lý hình ảnh, video và tài liệu dùng chung trong toàn bộ CMS.',
        itemUnit: 'tệp',
        uploadButton: 'Tải lên',
        albumsButton: 'Albums',
        searchPlaceholder: 'Tìm theo tên tệp hoặc định dạng...',
        emptyText: 'Chưa có tệp phương tiện nào.',
      },
      logs: {
        title: 'Nhật ký hoạt động',
        description: 'Theo dõi các thao tác quản trị, thay đổi quyền và hoạt động xuất bản trong hệ thống.',
        itemUnit: 'bản ghi',
        searchPlaceholder: 'Tìm kiếm trong nhật ký...',
      },
      trash: {
        title: 'Thùng rác',
        description: 'Khôi phục nội dung đã xóa hoặc xóa vĩnh viễn sau thời hạn lưu giữ.',
        itemUnit: 'mục',
        searchPlaceholder: 'Tìm kiếm trong thùng rác...',
      },
    },
  },
};

export const enCmsDictionary: CmsDictionary = {
  dashboard: {
    pageTitle: 'Operations Overview',
    pageDescription: 'Real-time monitoring hub, customer request processing, and operational activity audit for CIC Technology',
    customizeLayout: 'Customize Layout',
    currentWork: 'Current Tasks',
    currentWorkSubtitle: 'Drafts and customer inquiries requiring immediate attention',
    recentItems: 'recent items',
    noCurrentWork: 'No pending tasks at this moment.',
    draft: 'Draft',
    unread: 'Unread',
    processing: 'Processing',
    kpiProducts: 'Products',
    kpiNews: 'News',
    kpiStaticPages: 'Static Pages',
    kpiEvents: 'Events',
    kpiCustomerRequests: 'Customer Requests',
    kpiActive: 'Active',
    kpiPublished: 'Published',
    kpiUpcoming: 'Upcoming',
    kpiActionRequired: 'Pending!',
    kpiRequestsPending: 'Inquiries awaiting processing',
    customerRequests: 'Customer Inquiries',
    customerRequestsSubtitle: 'Latest incoming inquiries requiring processing',
    pendingContent: 'Pending Content',
    pendingContentSubtitle: 'Draft records awaiting publication',
    viewAll: 'View All',
    activityCharts: 'Activity & Inquiries Analytics',
    activityChartsSubtitle: 'Track interaction trends and content publication rate',
    range7Days: '7 Days',
    range30Days: '30 Days',
    rangeThisMonth: 'This Month',
    rangeThisYear: 'This Year',
    systemPulse: 'Recent System Audit',
    systemPulseSubtitle: 'Administrative action history and audit log',
    viewFullAudit: 'View Full Audit Log',
    noDataEn: 'No Dashboard Data for English',
    noDataEnDesc: 'The English workspace is an independent dataset and does not fall back to Vietnamese data.',
    customizerTitle: 'Customize Dashboard Layout',
    customizerSubtitle: 'Personalize widgets, density & display range',
    customizerSave: 'Save Changes',
    customizerReset: 'Reset to Default',
    densityComfortable: 'Comfortable',
    densityCompact: 'Compact',
  },
  header: {
    cmsSubtitle: 'Content Management System',
    searchPlaceholder: 'Search entire CMS (products, news, leads...)',
    quickSearchShort: 'Search CMS...',
    quickAction: 'New',
    newProduct: 'New Product',
    newNews: 'New Article',
    newService: 'New Service',
    newEvent: 'New Event',
    notifications: 'System Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications.',
    viewWebsite: 'View Website',
    myAccount: 'My Account',
    changePassword: 'Change Password',
    logout: 'Sign Out',
    roleSuperAdmin: 'Super Administrator',
    roleAdmin: 'Administrator',
    roleEditor: 'Editor',
    roleViewer: 'Viewer',
  },
  sidebar: {
    filterPlaceholder: 'Filter menu...',
    expandTitle: 'Expand sidebar (248px)',
    collapseTitle: 'Collapse sidebar (72px)',
    systemStatusOnline: 'System Status: Online',
    cmsFooterTitle: 'Content Management System',
  },
  menu: {
    groups: {
      grp_tong_quan: 'OVERVIEW',
      grp_noi_dung: 'CONTENT',
      grp_san_pham: 'PRODUCTS',
      grp_website: 'WEBSITE',
      grp_tuong_tac_khach_hang: 'CUSTOMER ENGAGEMENT',
      grp_khach_hang: 'CUSTOMER ENGAGEMENT',
      grp_quan_tri_he_thong: 'SYSTEM ADMINISTRATION',
      grp_he_thong: 'SYSTEM ADMINISTRATION',
    },
    items: {
      menu_dashboard: 'Overview',
      menu_news: 'News',
      menu_news_categories: 'News Categories',
      menu_static_pages: 'Static Pages',
      menu_events: 'Events',
      menu_projects: 'Projects',
      menu_services: 'Services',
      menu_products_group: 'Products',
      menu_product_categories: 'Product Categories',
      menu_product_brands: 'Manufacturers',
      menu_product_applications: 'Applications',
      menu_product_types: 'Product Types',
      menu_product_sales_staff: 'Sales Owners',
      menu_navigation: 'Menu',
      menu_media_library: 'Media Library',
      menu_media: 'Media Library',
      menu_cta: 'CTA',
      menu_forms: 'Forms',
      menu_customer_requests: 'Customer Requests',
      menu_email_templates: 'Email Templates',
      menu_users: 'Users',
      menu_cic_users: 'Users',
      menu_permissions: 'Roles & Permissions',
      menu_permission_management: 'Roles & Permissions',
      menu_system_settings: 'System Settings',
      menu_system_config: 'System Settings',
      menu_function_seo: 'SEO & URL',
      menu_translation_strings: 'Localization',
      menu_activity_logs: 'Activity Logs',
      menu_trash: 'Trash',
    },
  },
  common: {
    search: 'Search',
    searchPlaceholder: 'Search...',
    reset: 'Reset',
    resetFilters: 'Reset filters',
    filter: 'Filter',
    all: 'All',
    allStatus: 'All Statuses',
    allCategories: 'All Categories',
    status: 'Status',
    draft: 'Draft',
    published: 'Published',
    active: 'Active',
    inactive: 'Inactive',
    featured: 'Featured',
    home: 'Home',
    actions: 'Actions',
    created: 'Created',
    updated: 'Updated',
    author: 'Author',
    category: 'Category',
    viewCount: 'Views',
    price: 'Price',
    selectAll: 'Select all',
    publish: 'Publish',
    revertDraft: 'Revert to draft',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    preview: 'Preview',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    back: 'Back',
    confirm: 'Confirm',
    updatingList: 'Updating list...',
    noData: 'No records found',
    clearSearch: 'Clear search',
    items: 'items',
    refresh: 'Refresh',
  },
  modules: {
    news: {
      title: 'News',
      description: 'Create, edit, draft, and publish articles publicly.',
      itemUnit: 'articles',
      createButton: 'Add Article',
      searchPlaceholder: 'Search by title, alias, tags...',
      allCategories: '-- All Categories --',
      allStatus: '-- All Statuses --',
      draftStatus: 'Draft',
      publishedStatus: 'Published',
      emptyText: 'No news articles found.',
      columns: {
        articleAndAlerts: 'Article & Alerts',
        category: 'Category',
        author: 'Author',
        featured: 'Featured',
        home: 'Home',
        status: 'Status',
        publishedSchedule: 'Published / Schedule',
        updated: 'Updated',
        actions: 'Actions',
      },
      bulk: {
        itemLabel: 'articles',
        publish: 'Publish',
        revertDraft: 'Revert to draft',
        delete: 'Delete',
      },
    },
    newsCategories: {
      title: 'News Categories',
      description: 'Manage category taxonomy, display, and SEO for news pages.',
      itemUnit: 'categories',
      createButton: 'Add Category',
      searchPlaceholder: 'Search by category name or slug...',
      emptyText: 'No categories found matching your search.',
      columns: {
        name: 'Category Name',
        slug: 'Slug / URL',
        articles: 'Articles',
        ordering: 'Order',
        homepage: 'Homepage',
        status: 'Status',
        actions: 'Actions',
      },
    },
    products: {
      title: 'Products',
      description: 'Manage product catalog, pricing, brand taxonomy, application areas, and publishing status.',
      itemUnit: 'products',
      createButton: 'Add Product',
      tabs: {
        all: 'All Products',
        published: 'Published',
        draft: 'Draft',
        featured: 'Featured Products',
      },
      toolbar: {
        searchPlaceholder: 'Search by Name, SKU, Brand...',
        clearSearch: 'Clear search',
        allCategories: 'All Categories',
        allBrands: 'All Brands / Manufacturers',
        allProductTypes: 'All Product Types',
        allApplications: 'All Applications',
        resetFilters: 'Reset filters',
      },
      columns: {
        product: 'Product',
        code: 'Code / Alias',
        category: 'Category',
        brand: 'Manufacturer',
        productType: 'Product Type',
        application: 'Application',
        price: 'Price',
        status: 'Status',
        featured: 'Featured',
        views: 'Views',
        updated: 'Updated',
        actions: 'Actions',
      },
      emptyText: 'No products match the selected filters.',
    },
    events: {
      title: 'Events & Seminars',
      description: 'Manage events, scientific seminars, training sessions, and virtual webinars.',
      itemUnit: 'events',
      createButton: 'Add Event',
      searchPlaceholder: 'Search events by title...',
      editorialAll: 'Editorial Status: All',
      editorialDraft: 'Draft',
      editorialPublished: 'Published',
      progressAll: 'Progress Status: All',
      progressUpcoming: 'Upcoming',
      progressOngoing: 'Ongoing',
      progressEnded: 'Ended',
      columns: {
        title: 'Event Title',
        time: 'Event Date & Time',
        place: 'Location',
        status: 'Editorial Status',
        progress: 'Progress Status',
        actions: 'Actions',
      },
      emptyText: 'No events found.',
    },
    services: {
      title: 'Services',
      description: 'Manage service offerings, media, SEO, and publishing status.',
      itemUnit: 'services',
      createButton: 'Add Service',
      searchPlaceholder: 'Search by name or summary...',
      statusAll: 'All Editorial Statuses',
      statusDraft: 'Draft',
      statusPublished: 'Published',
      columns: {
        service: 'Service',
        status: 'Publishing Status',
        updated: 'Updated',
        actions: 'Actions',
      },
      emptyText: 'No services match the filter criteria.',
    },
    projects: {
      title: 'Featured Projects',
      description: 'Manage case studies, deployed solutions, and technical implementations.',
      itemUnit: 'projects',
      createButton: 'Add Project',
      searchPlaceholder: 'Search by project name, client...',
      columns: {
        project: 'Project',
        category: 'Category',
        status: 'Status',
        updated: 'Updated',
        actions: 'Actions',
      },
      emptyText: 'No projects found.',
    },
    staticPages: {
      title: 'Static Pages',
      description: 'Manage custom pages, company profiles, and content templates.',
      itemUnit: 'pages',
      createButton: 'Create Static Page',
      refreshButton: 'Refresh',
      emptyText: 'No static pages found.',
    },
    productTaxonomies: {
      categories: {
        title: 'Product Categories',
        description: 'Manage industry hierarchy and product taxonomy.',
        itemUnit: 'categories',
        createButton: 'Add Product Category',
        searchPlaceholder: 'Search by name, code, or description...',
        statusAll: 'All Statuses',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        bulkDeactivate: 'Deactivate Selected',
        columns: {
          nameAndCode: 'Name & Code Identifier',
          ordering: 'Order',
          status: 'Status',
          actions: 'Actions',
        },
        emptyText: 'No product categories found.',
      },
      brands: {
        title: 'Manufacturers & Brands',
        description: 'Manage technology partners, software vendors, and hardware makers.',
        itemUnit: 'brands',
        createButton: 'Add Manufacturer',
        searchPlaceholder: 'Search by brand name or alias...',
        statusAll: 'All Statuses',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        bulkDeactivate: 'Deactivate Selected',
        columns: {
          nameAndSlug: 'Brand Name & Alias',
          ordering: 'Order',
          status: 'Status',
          actions: 'Actions',
        },
        emptyText: 'No manufacturers found.',
      },
      applications: {
        title: 'Application Areas',
        description: 'Manage specialized application areas and industry groupings.',
        itemUnit: 'applications',
        createButton: 'Add Application Area',
        searchPlaceholder: 'Search by application name or alias...',
        statusAll: 'All Statuses',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        bulkDeactivate: 'Deactivate Selected',
        columns: {
          nameAndSlug: 'Application & Alias',
          ordering: 'Order',
          status: 'Status',
          actions: 'Actions',
        },
        emptyText: 'No application areas found.',
      },
      types: {
        title: 'Product Types',
        description: 'Manage software types, licensing options, and formats.',
        itemUnit: 'types',
        createButton: 'Add Product Type',
        searchPlaceholder: 'Search by type name or alias...',
        statusAll: 'All Statuses',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        bulkDeactivate: 'Deactivate Selected',
        columns: {
          nameAndSlug: 'Product Type & Alias',
          ordering: 'Order',
          status: 'Status',
          actions: 'Actions',
        },
        emptyText: 'No product types found.',
      },
      salesStaff: {
        title: 'Sales Owners',
        description: 'Manage product managers and sales contacts.',
        itemUnit: 'staff members',
        createButton: 'Add Sales Contact',
        searchPlaceholder: 'Search by name, email, phone...',
        statusAll: 'All Statuses',
        statusActive: 'Active',
        statusInactive: 'Suspended',
        columns: {
          fullName: 'Full Name',
          emailPhone: 'Email & Phone',
          assignedProducts: 'Assigned Products',
          ordering: 'Order',
          status: 'Status',
          actions: 'Actions',
        },
        emptyText: 'No sales owners found.',
      },
    },
    customerEngagement: {
      requests: {
        title: 'Customer Requests',
        description: 'Review, triage, and process quote requests and technical questions.',
        itemUnit: 'requests',
        tabs: {
          all: 'All',
          new: 'New Received',
          processing: 'Processing',
          completed: 'Completed',
          notSuitable: 'Not Suitable',
          cancelled: 'Cancelled',
        },
        searchPlaceholder: 'Search by name, email, phone, company...',
        emptyText: 'No customer requests found.',
      },
      forms: {
        title: 'Form Management',
        description: 'Manage website lead capture forms, event registrations, and surveys.',
        itemUnit: 'forms',
        createButton: 'Create New Form',
        searchPlaceholder: 'Search by name, code, title...',
        statusAll: 'All Statuses',
        emptyText: 'No forms found matching the filter.',
      },
      cta: {
        title: 'Calls to Action (CTA)',
        description: 'Manage button copy, placements, and navigation targets site-wide.',
        itemUnit: 'CTAs',
        createButton: 'Add CTA',
        searchPlaceholder: 'Search by button label, title, code...',
        statusAll: 'All Statuses',
        emptyText: 'No CTAs found.',
      },
      emailTemplates: {
        title: 'Email Templates',
        description: 'Configure automated notification emails for customers and administrators.',
        itemUnit: 'templates',
        createButton: 'Add Email Template',
        searchPlaceholder: 'Search by template name, subject, code...',
        eventAll: 'All Events',
        audienceAll: 'All Audiences',
        statusAll: 'All Statuses',
        emptyText: 'No email templates found.',
      },
    },
    system: {
      users: {
        title: 'CMS Users',
        description: 'Manage user accounts, profiles, roles, and administrative access permissions.',
        itemUnit: 'accounts',
        createButton: 'Add User',
        searchPlaceholder: 'Search by full name, email, username...',
        statusAll: 'All Statuses',
        roleAll: 'All Roles',
        agencyAll: 'All Branches',
        emptyText: 'No users found.',
      },
      permissions: {
        title: 'Roles & Permissions',
        description: 'Manage security roles and authorized operations across CMS modules.',
        itemUnit: 'active roles',
        createButton: 'Add Role',
        emptyText: 'No roles found.',
      },
      settings: {
        title: 'System Settings',
        description: 'Configure organization info, contact channels, and website preferences.',
      },
      seo: {
        title: 'SEO & URLs',
        description: 'Control search engine visibility, SEO templates, and website URL lifecycle.',
        itemUnit: 'system modules',
        createButton: 'Add SEO Config',
        tabs: {
          overview: 'Health Overview',
          templates: 'System Pages & SEO Templates',
          redirects: 'Redirects (301/302) & Sitemap',
        },
      },
      menu: {
        title: 'Navigation Menus',
        description: 'Manage hierarchical menu links across header, footer, and sidebars.',
        createButton: 'Add Menu',
      },
      media: {
        title: 'Media Library',
        description: 'Manage shared images, videos, and documents used throughout the CMS.',
        itemUnit: 'files',
        uploadButton: 'Upload Media',
        albumsButton: 'Albums',
        searchPlaceholder: 'Search by filename or format...',
        emptyText: 'No media files found.',
      },
      logs: {
        title: 'Activity Logs',
        description: 'Track administrative actions, permission changes, and publishing activities.',
        itemUnit: 'records',
        searchPlaceholder: 'Search activity logs...',
      },
      trash: {
        title: 'Trash Bin',
        description: 'Restore deleted content or permanently purge items after retention expires.',
        itemUnit: 'items',
        searchPlaceholder: 'Search trash items...',
      },
    },
  },
};

export function getCmsDictionary(locale: CmsLocale): CmsDictionary {
  return locale === 'en' ? enCmsDictionary : viCmsDictionary;
}
