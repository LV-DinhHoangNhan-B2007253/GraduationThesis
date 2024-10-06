from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import csv

# Đặt đường dẫn đến chromedriver.exe
chromedriver_path = os.path.join('D:\\RefactorThesis\\GraduationThesis\\trainAI', 'chromedriver.exe')

# Cấu hình trình duyệt
options = webdriver.ChromeOptions()
# options.add_argument('--headless')  # Bỏ comment dòng này nếu bạn muốn chạy ở chế độ không có đầu
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# Khởi tạo trình duyệt với đường dẫn đến chromedriver
service = Service(chromedriver_path)
driver = webdriver.Chrome(service=service, options=options)

# Mở trang sản phẩm
url = "https://www.lazada.vn/products/ban-hoc-lam-viec-gap-gon-da-nang-ban-de-giuong-co-khe-cam-dien-thoai-khay-dung-coc-khe-cam-usb-thong-minh-tien-i2401196181-s11721177293.html"
driver.get(url)

comments_list = []  # Danh sách lưu các bình luận

try:
    while True:  # Vòng lặp để thu thập bình luận từ nhiều trang
        # Chờ cho bình luận xuất hiện
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'item'))
        )

        # Lấy danh sách bình luận
        comments = driver.find_elements(By.CLASS_NAME, 'item')

        for comment in comments:
            try:
                content = comment.find_element(By.CLASS_NAME, 'content').text
                print(content)

                # Lấy số sao từ bình luận
                star_element = comment.find_element(By.CLASS_NAME, 'starCtn')
                star_width = star_element.size['width']
                number_of_stars = int(star_width // 16.625)

                # Gán nhãn dựa trên số sao
                label = 0 if number_of_stars < 3 else 1 if number_of_stars < 5 else 2

                # Thêm nội dung và nhãn vào danh sách
                comments_list.append([content, label])

            except Exception as inner_e:
                print(f"Lỗi khi xử lý bình luận: {inner_e}")

        # Kiểm tra xem có nút chuyển trang tiếp theo hay không
        try:
            next_button = driver.find_element(By.CLASS_NAME, 'next')

            # Chờ cho phần tử chặn biến mất (nếu có)
            WebDriverWait(driver, 10).until(
                EC.invisibility_of_element_located((By.CLASS_NAME, 'baxia-dialog-mask'))
            )

            # Cuộn đến nút tiếp theo
            driver.execute_script("arguments[0].scrollIntoView();", next_button)

            # Nhấp vào nút "tiếp theo"
            next_button.click()

            # Thêm thời gian chờ trước khi thu thập bình luận trên trang mới
            time.sleep(3)  # Thay đổi thời gian nếu cần, có thể tăng lên 4-5 giây để đảm bảo tải đầy đủ

            # Chờ cho bình luận mới tải lên
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'item')))  # Chờ cho bình luận mới tải lên

        except Exception as e:
            print(f"Lỗi khi chuyển trang: {e}")
            break  # Thoát vòng lặp nếu không thể chuyển trang

    # Đường dẫn đến tệp để lưu bình luận
    comments_file_path = os.path.join('D:\\RefactorThesis\\GraduationThesis\\trainAI', 'comments.csv')

    # Mở tệp CSV để ghi
    with open(comments_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['Nội dung', 'Nhãn'])  # Tiêu đề cột cho nội dung và nhãn
        
        for content, label in comments_list:
            csvwriter.writerow([content, label])

    print(f"Đã lưu {len(comments_list)} bình luận vào tệp {comments_file_path}")

except Exception as e:
    print(f"Lỗi: {e}")
finally:
    driver.quit()  # Đảm bảo trình duyệt được đóng sau khi thực hiện