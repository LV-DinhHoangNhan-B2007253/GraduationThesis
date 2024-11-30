from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
from rasa_sdk.events import SlotSet
api="http://localhost:3001/api"


# fallback -> done
class ActionFallback(Action):
    
    def name(self) -> Text:
        return "action_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)


        dispatcher.utter_message(text="Xin lỗi bạn, tôi chưa hiểu ý bạn lắm, bạn hãy cung cấp thêp thông tin giúp mình nha.")

        return []
    

# hỏi về các loại sản phẩm -> done
class AskProductType(Action):
    
    def name(self) -> Text:
        return "action_ask_product_type"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        product_types = ["Bàn","Kệ","Tủ","Sofa","Ghế","Giường ngủ","Đồ trang trí","Gương","Chăn ga gối nệm","Đồ dùng văn phòng","Đèn trang trí"]
        json_message = {
            "list_text":product_types
        }
        dispatcher.utter_message(text=f"Dạ hiện tại website có các loại mặt hàng sau" , json_message=json_message)

        return []




    

# hỏi về thương hiệu -> done
class AskProductBrand(Action):
    
    def name(self) -> Text:
        return "action_ask_product_brand"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)


        dispatcher.utter_message(text="Tất cả sản phẩm của cửa hàng đều được cung cấp bởi công ty TNHH 1 thành viên DHN-Company và được gọi với thương hiệu là AikaLuxury")

        return []

# số lượng sản phẩm trong giỏ hàng -> done
class AskCartQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_cart_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy user ID từ metadata
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if user_id:
            # Gửi yêu cầu đến API
            response = requests.get(f"http://localhost:3001/api/user/getOne/{user_id}")
            
            if response.status_code == 200:
                # Chuyển đổi dữ liệu JSON
                user_data = response.json()
                cart_size = len(user_data.get('cart', []))
                
                # Phản hồi với số lượng sản phẩm trong giỏ hàng
                dispatcher.utter_message(text=f"Hiện tại bạn có {cart_size} sản phẩm trong giỏ hàng.")
            else:
                # Xử lý lỗi từ API
                dispatcher.utter_message(text="Không thể lấy thông tin giỏ hàng của bạn. Vui lòng thử lại sau.")
        else:
            # Trường hợp không có user ID
            dispatcher.utter_message(text="Hiện tại bạn chưa đăng nhập.")

        return []

# số lượng sản phẩm trong danh sách yêu thích -> done
class AskWishListQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_wishlist_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
           # Lấy user ID từ metadata
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if user_id:
            # Gửi yêu cầu đến API
            response = requests.get(f"http://localhost:3001/api/user/getOne/{user_id}")
            
            if response.status_code == 200:
                # Chuyển đổi dữ liệu JSON
                user_data = response.json()
                wishlist_size = len(user_data.get('wishlist', []))
                
                # Phản hồi với số lượng sản phẩm trong giỏ hàng
                dispatcher.utter_message(text=f"Hiện tại bạn có {wishlist_size} sản phẩm trong danh sách yêu thích.")
            else:
                # Xử lý lỗi từ API
                dispatcher.utter_message(text="Không thể lấy thông tin danh sách yêu thích của bạn của bạn. Vui lòng thử lại sau.")
        else:
            # Trường hợp không có user ID
            dispatcher.utter_message(text="Hiện tại bạn chưa đăng nhập.")

        return []
# thông tin sản phẩm trong giỏ hàng -> done

class AskCartProduct(Action):
    
    def name(self) -> Text:
        return "action_ask_cart_products"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
       
        # Lấy userId từ metadata
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if not user_id:
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem danh sách yêu thích.")
            return []
        
        try:
            # Gửi yêu cầu API để lấy thông tin người dùng
            user_response = requests.get(f"http://localhost:3001/api/user/getOne/{user_id}")
            
            if user_response.status_code != 200:
                dispatcher.utter_message(text="Không thể lấy thông tin người dùng. Vui lòng thử lại sau.")
                return []
            
            user_data = user_response.json()
            cart = user_data.get("cart", [])
            
            if not cart:
                dispatcher.utter_message(text="Giỏ hàng của bạn hiện đang trống.")
                return []

            # Lấy thông tin chi tiết từng sản phẩm trong cart
            products_data = []
            for product in cart:
                # Lấy product_id từ cart
                product_id = product.get('product_id')  # Sử dụng .get() để tránh lỗi nếu khóa không tồn tại
                
                if not product_id:
                    products_data.append({
                        "name": "Không xác định",
                        "price": "N/A",
                        "url": ""
                    })
                    continue
                
                # Gửi yêu cầu lấy thông tin sản phẩm
                product_response = requests.get(f"http://localhost:3001/api/product/get/{product_id}")
                
                if product_response.status_code == 200:
                    product_data = product_response.json()
                    
                    # Lấy tên, giá và hình ảnh đầu tiên
                    product_name = product_data.get("name", "Không xác định")
                    product_id = product_data.get("_id", None)
                    product_price = product_data.get("price", "N/A")
                    product_url = product_data.get("images", [None])[0]  # Lấy hình ảnh đầu tiên
                    
                    # Định dạng sản phẩm dưới dạng dictionary
                    product_info = {
                        "name": product_name,
                        "price": product_price,
                        "url": product_url,
                        "product_id":product_id
                    }
                    products_data.append(product_info)
                else:
                    products_data.append({
                        "name": "Không xác định",
                        "price": "N/A",
                        "url": "",
                        "product_id":None

                    })

            # Trả về thông điệp theo đúng định dạng yêu cầu
            message = "Dưới đây là các sản phẩm trong giỏ hàng của bạn."
            json_message = {
                "product": products_data  # Trả về danh sách sản phẩm
            }

            dispatcher.utter_message(text=message, json_message=json_message)

        except Exception as e:
            dispatcher.utter_message(text=f"Đã xảy ra lỗi: {str(e)}")
        
        return []
# thông tin các sản phẩm trong wishlist -> done
class AskWishListProduct(Action):
    
    def name(self) -> Text:
        return "action_ask_wishlist_product"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy userId từ metadata
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if not user_id:
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem danh sách yêu thích.")
            return []
        
        try:
            # Gửi yêu cầu API để lấy thông tin người dùng
            user_response = requests.get(f"http://localhost:3001/api/user/getOne/{user_id}")
            
            if user_response.status_code != 200:
                dispatcher.utter_message(text="Không thể lấy thông tin người dùng. Vui lòng thử lại sau.")
                return []
            
            user_data = user_response.json()
            wishlist = user_data.get("wishlist", [])
            
            if not wishlist:
                dispatcher.utter_message(text="Danh sách yêu thích của bạn hiện đang trống.")
                return []

            # Lấy thông tin chi tiết từng sản phẩm trong wishlist
            products_data = []
            for product_id in wishlist:
                product_response = requests.get(f"http://localhost:3001/api/product/get/{product_id}")
                
                if product_response.status_code == 200:
                    product = product_response.json()
                    
                    # Lấy tên, giá và hình ảnh đầu tiên
                    product_name = product.get("name", "Không xác định")
                    product_price = product.get("price", "N/A")
                    product_id = product.get("_id", None)

                    product_url = product.get("images", [None])[0]  # Lấy hình ảnh đầu tiên
                    
                    # Định dạng sản phẩm dưới dạng dictionary
                    product_info = {
                        "name": product_name,
                        "price": product_price,
                        "url": product_url,
                        "product_id":product_id

                    }
                    products_data.append(product_info)
                else:
                    products_data.append({
                        "name": "Không xác định",
                        "price": "N/A",
                        "url": "",
                        "product_id":None
                    })

            # Trả về thông điệp theo đúng định dạng yêu cầu
            message = "Dưới đây là các sản phẩm trong danh sách yêu thích của bạn."
            json_message = {
                "product": products_data  # Trả về danh sách sản phẩm
            }

            dispatcher.utter_message(text=message, json_message=json_message)

        except Exception as e:
            dispatcher.utter_message(text=f"Đã xảy ra lỗi: {str(e)}")
        
        return []

# số lượng đơn hàng đã đặt -> done
class AskOrderQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy userId từ metadata của tin nhắn
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if not user_id:
            # Nếu không có user_id, yêu cầu người dùng đăng nhập
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem lịch sử đặt hàng")
            return []
        
        # Gọi API để lấy danh sách đơn hàng của người dùng
        try:
            response = requests.get(f"http://localhost:3001/api/order/find/{user_id}")
            orders = response.json()  # Lấy dữ liệu JSON từ phản hồi
            
            # Kiểm tra nếu response trả về dữ liệu hợp lệ
            if not orders or not isinstance(orders, list):
                dispatcher.utter_message(text="Không có đơn hàng nào được tìm thấy.")
                return []
            
            # Trả về số lượng đơn hàng
            order_quantity = len(orders)
            dispatcher.utter_message(text=f"Số lượng đơn hàng bạn đã đặt là: {order_quantity}")
        
        except requests.exceptions.RequestException as e:
            # Nếu có lỗi khi gọi API, thông báo lỗi cho người dùng
            dispatcher.utter_message(text="Đã có lỗi xảy ra khi lấy thông tin đơn hàng. Vui lòng thử lại sau.")
        
        return []
#  số lượng đơn hàng đang xử lí -> done
class AskOrderByStatusPendingQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_by_status_pending_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy userId từ metadata của tin nhắn
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if not user_id:
            # Nếu không có user_id, yêu cầu người dùng đăng nhập
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem lịch sử đặt hàng")
            return []
        
        # Gọi API để lấy danh sách đơn hàng của người dùng
        try:
            response = requests.get(f"http://localhost:3001/api/order/find/{user_id}")
            orders = response.json()  # Lấy dữ liệu JSON từ phản hồi
            
            # Kiểm tra nếu response trả về dữ liệu hợp lệ
            if not orders or not isinstance(orders, list):
                dispatcher.utter_message(text="Không có đơn hàng nào được tìm thấy.")
                return []
            
            # Đếm số lượng đơn hàng có trạng thái "pending"
            pending_orders = [order for order in orders if order.get("status") == "pending"]
            pending_quantity = len(pending_orders)
            
            dispatcher.utter_message(text=f"Số lượng đơn hàng đang chờ xử lý (pending) của bạn là: {pending_quantity}")
        
        except requests.exceptions.RequestException as e:
            # Nếu có lỗi khi gọi API, thông báo lỗi cho người dùng
            dispatcher.utter_message(text="Đã có lỗi xảy ra khi lấy thông tin đơn hàng. Vui lòng thử lại sau.")
        
        return []

# số lượng đơn hàng đang giao -> done
class AskOrderByStatusDeliveryQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_by_status_delivery_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy userId từ metadata của tin nhắn
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if not user_id:
            # Nếu không có user_id, yêu cầu người dùng đăng nhập
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem lịch sử đặt hàng")
            return []
        
        # Gọi API để lấy danh sách đơn hàng của người dùng
        try:
            response = requests.get(f"http://localhost:3001/api/order/find/{user_id}")
            orders = response.json()  # Lấy dữ liệu JSON từ phản hồi
            
            # Kiểm tra nếu response trả về dữ liệu hợp lệ
            if not orders or not isinstance(orders, list):
                dispatcher.utter_message(text="Không có đơn hàng nào được tìm thấy.")
                return []
            
            # Đếm số lượng đơn hàng có trạng thái "delivery"
            delivery_orders = [order for order in orders if order.get("status") == "delivery"]
            delivery_quantity = len(delivery_orders)
            
            dispatcher.utter_message(text=f"Số lượng đơn hàng đang giao (delivery) của bạn là: {delivery_quantity}")
        
        except requests.exceptions.RequestException as e:
            # Nếu có lỗi khi gọi API, thông báo lỗi cho người dùng
            dispatcher.utter_message(text="Đã có lỗi xảy ra khi lấy thông tin đơn hàng. Vui lòng thử lại sau.")
        
        return []
    
# số lượng đơn đã giao -> done
class AskOrderByStatusShippedQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_by_status_shipped_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy userId từ metadata của tin nhắn
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        
        if not user_id:
            # Nếu không có user_id, yêu cầu người dùng đăng nhập
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem lịch sử đặt hàng")
            return []
        
        # Gọi API để lấy danh sách đơn hàng của người dùng
        try:
            response = requests.get(f"http://localhost:3001/api/order/find/{user_id}")
            orders = response.json()  # Lấy dữ liệu JSON từ phản hồi
            
            # Kiểm tra nếu response trả về dữ liệu hợp lệ
            if not orders or not isinstance(orders, list):
                dispatcher.utter_message(text="Không có đơn hàng nào được tìm thấy.")
                return []
            
            # Đếm số lượng đơn hàng có trạng thái "shipped"
            shipped_orders =[order for order in orders if order.get("status") in ["shipped", "reviewed"]]
            shipped_quantity = len(shipped_orders)
            
            dispatcher.utter_message(text=f"Số lượng đơn hàng đã giao (shipped) của bạn là: {shipped_quantity}")
        
        except requests.exceptions.RequestException as e:
            # Nếu có lỗi khi gọi API, thông báo lỗi cho người dùng
            dispatcher.utter_message(text="Đã có lỗi xảy ra khi lấy thông tin đơn hàng. Vui lòng thử lại sau.")
        
        return []

# bao nhiêu danh mục ->done
class AskAboutCategories(Action):
    
    def name(self) -> Text:
        return "action_ask_about_categories"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Gọi API lấy danh sách các danh mục
        response = requests.get('http://localhost:3001/api/category/getAll')
        
        if response.status_code == 200:
            categories = response.json()
            
            # Tạo mảng danh mục với category_id, name, và product_quantity
            category_info = []
            for category in categories:
                category_id = category.get("_id")
                name = category.get("name")
                product_quantity = len(category.get("products", []))  # Đếm số lượng sản phẩm trong mảng products

                category_info.append({
                    "category_id": category_id,
                    "name": name,
                    "product_quantity": product_quantity
                })

            # Trả về số lượng danh mục và danh sách các danh mục
            num_categories = len(categories)
            message = f"Cửa hàng hiện có {num_categories} danh mục"
            
            # Tạo thông điệp và dữ liệu JSON theo yêu cầu
            json_message = {
                "category": category_info  # Trả về mảng danh mục
            }

            dispatcher.utter_message(text=message, json_message=json_message)
            return []
        else:
            # Nếu không gọi API thành công
            dispatcher.utter_message(text="Không thể lấy danh mục sản phẩm hiện tại. Vui lòng thử lại sau.")
            return []
    
 
# liệt kê các sản phẩm theo danh mục -> done
class FindProductsByCategory(Action):

    def name(self) -> Text:
        return "action_find_products_by_category"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Lấy tên danh mục từ entity category_name
        category_name = tracker.get_slot("category_name")
        
        # Gọi API lấy tất cả danh mục
        response = requests.get('http://localhost:3001/api/category/getAll')
        
        if response.status_code == 200:
            categories = response.json()
            # Tìm danh mục theo tên
            category = next((cat for cat in categories if cat["name"].lower() == category_name.lower()), None)
            
            if category:
                # Tìm các sản phẩm theo danh mục
                product_ids = category.get("products", [])
                products = []
                
                # Lấy thông tin sản phẩm từ API bằng ID
                for product_id in product_ids:
                    product_response = requests.get(f'http://localhost:3001/api/product/get/{product_id}')
                    
                    if product_response.status_code == 200:
                        product_data = product_response.json()
                        # Lấy tên, giá và hình ảnh đầu tiên của sản phẩm
                        product_name = product_data.get("name", "Không xác định")
                        product_price = product_data.get("price", "N/A")
                        proId= product_data.get("_id", None)
                        product_url = product_data.get("images", [None])[0]  # Lấy hình ảnh đầu tiên
                        
                        # Thêm sản phẩm vào danh sách
                        products.append({
                            "name": product_name,
                            "price": product_price,
                            "url": product_url,
                            "product_id":proId
                        })
                    
                # Trả về danh sách sản phẩm nếu tìm thấy
                if products:
                    # Tạo thông điệp trả về với thông tin danh mục và sản phẩm
                    message = f"Dưới đây là các sản phẩm trong danh mục {category_name}:"
                    
                    # Trả về JSON chứa danh sách sản phẩm
                    json_message = {
                        "product": products  # Trả về danh sách sản phẩm
                    }
                    dispatcher.utter_message(text=message, json_message=json_message)
                else:
                    dispatcher.utter_message(text=f"Không tìm thấy sản phẩm nào trong danh mục {category_name}.")
            else:
                dispatcher.utter_message(text=f"Không tìm thấy danh mục {category_name}.")
        else:
            dispatcher.utter_message(text="Lỗi khi lấy danh mục từ API.")

        return []

class FindProductsByPriceRange(Action):
    
    def name(self) -> Text:
        return "action_find_products_by_price_range"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy giá trị từ các slot
        product_name = tracker.get_slot("product_name")  # Tên sản phẩm
        from_price = tracker.get_slot("from_price")      # Giá bắt đầu
        to_price = tracker.get_slot("to_price")          # Giá kết thúc
        print(f"tên sản phẩm: {product_name}, giá đầu: {from_price}, giá cuối: {to_price}")

        # Nếu không có giá trị from_price hoặc to_price thì gán giá mặc định
        from_price = float(from_price) if from_price else 0.0
        
        # Kiểm tra và ép kiểu to_price thành float nếu có, nếu không có gán là vô cùng
        if to_price:
            to_price = float(to_price)
        else:
            to_price = float('inf')  # Gán giá trị vô cùng nếu không có to_price

        # Bước 1: Lấy tất cả các sản phẩm từ API
        response = requests.get("http://localhost:3001/api/product/getAll")
        if response.status_code != 200:
            dispatcher.utter_message(text="Có lỗi xảy ra khi lấy danh sách sản phẩm.")
            return []

        products = response.json()  # Dữ liệu sản phẩm từ API

        # Bước 2: Lọc các sản phẩm theo khoảng giá và tên sản phẩm nếu có
        filtered_products = []

        for product in products:
            product_price = float(product.get("price", 0))  # Đảm bảo giá là kiểu float
            product_name_check = product.get("name", "").lower()

            # Kiểm tra giá và tên sản phẩm
            if (from_price <= product_price <= to_price):
                # Nếu có tên sản phẩm, kiểm tra xem tên có chứa chuỗi tìm kiếm (match gần đúng)
                if product_name:
                    if product_name.lower() in product_name_check:
                        product_url = product.get("images", [None])[0]  # Lấy hình ảnh đầu tiên

                        # Chỉ thêm sản phẩm vào kết quả nếu có hình ảnh
                        if product_url:
                            filtered_products.append({
                                "name": product.get("name", "Không xác định"),
                                "price": product_price,
                                "url": product_url,
                                "product_id": product.get("_id")
                            })
                else:
                    # Nếu không có tên sản phẩm, chỉ cần lọc theo khoảng giá
                    product_url = product.get("images", [None])[0]  # Lấy hình ảnh đầu tiên

                    # Chỉ thêm sản phẩm vào kết quả nếu có hình ảnh
                    if product_url:
                        filtered_products.append({
                            "name": product.get("name", "Không xác định"),
                            "price": product_price,
                            "url": product_url,
                            "product_id": product.get("_id")
                        })

        # Bước 3: Trả về thông tin sản phẩm dưới dạng JSON
        if filtered_products:
            json_message = {
                "product": filtered_products  # Trả về danh sách sản phẩm
            }
            dispatcher.utter_message(text="Dưới đây là các sản phẩm tìm thấy:", json_message=json_message)
        else:
            dispatcher.utter_message(text="Không có sản phẩm nào phù hợp với yêu cầu của bạn.")

        return []
# tìm sản phẩm bằng tên -> done    
class FindProductsByName(Action):

    def name(self) -> str:
        return "action_find_products_by_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Lấy tên sản phẩm từ tracker
        product_name = tracker.get_slot('product_name')
        if not product_name:
            dispatcher.utter_message(text="Xin vui lòng cung cấp tên sản phẩm để tìm kiếm.")
            return []

        print(f"tên sản phẩm trích lọc được: {product_name}")
        
        # Gọi API để tìm kiếm sản phẩm theo tên
        url = f"http://localhost:3001/api/category/search?query={product_name}"
        
        try:
            # Gọi API để lấy danh sách sản phẩm
            response = requests.get(url)
            
            # Kiểm tra xem phản hồi có phải là JSON hay không
            if response.status_code != 200:
                dispatcher.utter_message(text="Đã có lỗi xảy ra khi tìm kiếm sản phẩm. Vui lòng thử lại sau.")
                return []
            
            # Trích xuất dữ liệu từ phản hồi
            data = response.json()  # Lấy dữ liệu JSON từ response
            products = data.get("products", [])  # Lấy danh sách sản phẩm từ phản hồi

            if not products:
                dispatcher.utter_message(text="Không có sản phẩm nào phù hợp với yêu cầu của bạn.")
                return []

            # Tạo mảng product chứa thông tin cần thiết của sản phẩm
            product_list = []
            for product in products[:10]:  # Lấy 10 sản phẩm đầu tiên
                product_info = {
                    "product_id": product.get("_id", ""),
                    "name": product.get("name", ""),
                    "price": product.get("price", ""),
                    "url": product["images"][0] if product.get("images") else None
                    
                }
                product_list.append(product_info)

            # Gửi danh sách sản phẩm cho người dùng
            json_message = {
                'product': product_list,
                "sub_link_name":"Xem tất cả",
                "sub_link_url":'/product/all'
            }
            dispatcher.utter_message(text="Dưới đây là một số sản phẩm tham khảo cho yêu cầu của bạn", json_message=json_message)

        except requests.exceptions.RequestException as e:
            dispatcher.utter_message(text="Đã có lỗi xảy ra khi tìm kiếm sản phẩm. Vui lòng thử lại sau.")
            return []

        return []
    

    

class SuggestProductLargeArea(Action):
    
    def name(self) -> Text:
        return "action_suggest_product_large_area"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)


        dispatcher.utter_message(text="action_suggest_product_large_area")

        return []
    
class SuggestProductMediumArea(Action):
    
    def name(self) -> Text:
        return "action_suggest_product_medium_area"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)


        dispatcher.utter_message(text="action_suggest_product_medium_area")

        return []
    
class SuggestProductSmallArea(Action):
    
    def name(self) -> Text:
        return "action_suggest_product_small_area"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)


        dispatcher.utter_message(text="action_suggest_product_small_area")

        return []
    
