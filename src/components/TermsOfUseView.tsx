import React from 'react';
import { LegalArticleLayout, LegalSection } from './LegalArticleLayout';
import { CheckCircle2 } from 'lucide-react';

interface TermsOfUseViewProps {
  onNavigateHome: () => void;
}

export const TermsOfUseView: React.FC<TermsOfUseViewProps> = ({ onNavigateHome }) => {
  const sections: LegalSection[] = [
    {
      id: '01',
      title: 'Quy định chung khi sử dụng website',
      content: (
        <div className="space-y-3">
          <p>
            Khi truy cập và sử dụng dịch vụ trên website{' '}
            <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold">
              www.cic.com.vn
            </a>
            , quý khách hàng mặc định đồng ý với các điều khoản điều kiện này. Trong trường hợp không đồng ý với bất kỳ điều khoản nào, vui lòng tạm dừng việc truy cập và sử dụng website.
          </p>
          <p>
            Khách hàng cam kết sử dụng trang web cho các mục đích hợp pháp liên quan đến tìm hiểu thông tin sản phẩm, giải pháp kỹ thuật, dịch vụ tư vấn và đào tạo của CIC. Nghiêm cấm các hành vi can thiệp hệ thống, phát tán mã độc, tự động cào dữ liệu trái phép hoặc đăng tải nội dung vi phạm pháp luật.
          </p>
        </div>
      )
    },
    {
      id: '02',
      title: 'Sở hữu trí tuệ và Bản quyền nội dung',
      content: (
        <div className="space-y-3">
          <p>
            Toàn bộ nội dung đăng tải trên website bao gồm văn bản, bài viết chuyên môn, tài liệu kỹ thuật, hình ảnh, video giới thiệu phần mềm CAD/BIM và giao diện thương hiệu thuộc quyền sở hữu trí tuệ của Công ty Cổ phần Công nghệ và Tư vấn CIC hoặc bên cấp phép hợp pháp.
          </p>
          <p>
            Mọi hành vi sao chép, trích dẫn, phân phối hoặc tái sử dụng cho mục đích thương mại mà chưa có sự đồng ý bằng văn bản từ đại diện hợp pháp của CIC đều bị nghiêm cấm.
          </p>
        </div>
      )
    },
    {
      id: '03',
      title: 'Quy định về tài liệu tải xuống và Phần mềm dùng thử',
      content: (
        <div className="space-y-3">
          <p>
            Các tài liệu kỹ thuật, catalog, tài liệu hướng dẫn và bộ cài đặt dùng thử (demo) được cung cấp nhằm mục đích nghiên cứu, học thuật và đánh giá sản phẩm.
          </p>
          <ul className="space-y-2 pl-1">
            {[
              'Chỉ sử dụng tài liệu cho mục đích nghiên cứu, học tập hoặc khảo sát phi thương mại;',
              'Tuyệt đối không bẻ khóa (crack), dịch ngược (reverse engineering) hoặc can thiệp mã nguồn phần mềm;',
              'Giữ nguyên thông tin nguồn gốc xuất xứ và nhãn hiệu bản quyền khi trích dẫn tài liệu;',
              'Người dùng tự kiểm tra an toàn thiết bị trước khi chạy các tệp tin tải về từ internet.'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: '04',
      title: 'Miễn trừ và Giới hạn trách nhiệm pháp lý',
      content: (
        <div className="space-y-3">
          <p>
            CIC nỗ lực tối đa để đảm bảo thông tin trên website là chính xác và được cập nhật thường xuyên. Tuy nhiên, chúng tôi không bảo đảm tuyệt đối rằng không có các sơ suất về kỹ thuật hoặc lỗi đánh máy ngoài ý muốn.
          </p>
          <p>
            CIC miễn trừ trách nhiệm với các thiệt hại gián tiếp phát sinh từ việc gián đoạn kết nối internet, sự cố thiết bị cá nhân hoặc việc truy cập các liên kết của bên thứ ba nằm ngoài hệ thống của CIC.
          </p>
        </div>
      )
    },
    {
      id: '05',
      title: 'Cập nhật và Thay đổi các điều khoản sử dụng',
      content: (
        <div className="space-y-3">
          <p>
            CIC có quyền thay đổi, bổ sung hoặc điều chỉnh các điều khoản sử dụng này vào bất kỳ lúc nào để phù hợp với quy định pháp luật và hoạt động thực tế. Các thay đổi sẽ có hiệu lực ngay khi công bố trên website.
          </p>
        </div>
      )
    }
  ];

  return (
    <LegalArticleLayout
      categoryTag="QUY ĐỊNH & PHÁP LÝ"
      title="Điều Khoản Sử Dụng"
      subtitle="Quy định chung về quyền hạn, trách nhiệm, sở hữu trí tuệ và việc truy cập tài nguyên số tại website của Công ty Cổ phần Công nghệ và Tư vấn CIC."
      lastUpdated="19/07/2026"
      readingTime="3 phút"
      sections={sections}
      onNavigateHome={onNavigateHome}
    />
  );
};
