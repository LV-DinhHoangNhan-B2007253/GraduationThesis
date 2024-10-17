import pandas as pd
from sklearn.model_selection import train_test_split

# Đường dẫn đến file CSV
file_path = 'D:\\GraduationThesis\\trainAI\\raw-data.csv'

# Đọc file CSV
data = pd.read_csv(file_path, header=None, on_bad_lines='skip')

# Tiền xử lý dữ liệu
X = data[0]  # Dữ liệu đầu vào (đánh giá)
y = data[1]  # Nhãn (nhãn đánh giá)

# Loại bỏ các hàng có giá trị NaN trong nhãn và đồng thời loại bỏ hàng tương ứng trong X
data_cleaned = data.dropna(subset=[1])
X = data_cleaned[0]  # Dữ liệu đầu vào sau khi làm sạch
y = data_cleaned[1].astype(int)  # Nhãn sau khi làm sạch và chuyển thành số nguyên

# Chia dữ liệu thành tập huấn luyện và tập kiểm tra
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Tạo DataFrame cho tập huấn luyện và tập kiểm tra
train_data = pd.DataFrame({'review': X_train, 'label': y_train})
test_data = pd.DataFrame({'review': X_test, 'label': y_test})

# Lưu tập huấn luyện và tập kiểm tra vào file CSV
train_data.to_csv('D:\\GraduationThesis\\trainAI\\train_data.csv', index=False)
test_data.to_csv('D:\\GraduationThesis\\trainAI\\test_data.csv', index=False)

print("Tập dữ liệu đã được chia và lưu thành công!")