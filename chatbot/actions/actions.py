from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

sever="http://localhost:3001"


class ActionFallback(Action):
    
    def name(self) -> Text:
        return "action_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Xin lỗi bạn, tôi chưa hiểu ý bạn lắm, bạn hãy cung cấp thêp thông tin giúp mình nha.")

        return []
    

class AskProductType(Action):
    
    def name(self) -> Text:
        return "action_ask_product_type"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_id = tracker.latest_message.get('metadata', {}).get('userId', None)
        print(user_id)
        if user_id:
            dispatcher.utter_message(text=f"User ID của bạn là: {user_id}")
        else:
            dispatcher.utter_message(text="Không tìm thấy User ID trong metadata.")

        return []

class AskProductPrice(Action):
    
    def name(self) -> Text:
        return "action_ask_product_price"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_price")

        return []

class AskProductSale(Action):
    
    def name(self) -> Text:
        return "action_ask_product_sale"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_sale")

        return []
    

class AskProductBrand(Action):
    
    def name(self) -> Text:
        return "action_ask_product_brand"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_brand")

        return []


class AskCartQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_cart_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_cart_quantity")

        return []

class AskWishListQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_wishlist_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_wishlist_quantity")

        return []
    
class AskCartProduct(Action):
    
    def name(self) -> Text:
        return "action_ask_cart_products"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_cart_products")

        return []
    
class AskWishListProduct(Action):
    
    def name(self) -> Text:
        return "action_ask_wishlist_product"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_wishlist_product")

        return []
    
class AskOrderQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_order_quantity")

        return []
    
class AskOrderByStatusPendingQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_by_status_pending_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_order_by_status_pending_quantity")

        return []
    

class AskOrderByStatusDeliveryQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_by_status_delivery_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_order_by_status_delivery_quantity")

        return []
    
class AskOrderByStatusShippedQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_order_by_status_shipped_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_order_by_status_shipped_quantity")

        return []
    
class AskAboutCategories(Action):
    
    def name(self) -> Text:
        return "action_ask_about_categories"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_about_categories")

        return []
    
    
class AskProductQuantityByCategory(Action):
    
    def name(self) -> Text:
        return "action_ask_product_quantity_by_category"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_quantity_by_category")

        return []
    
class AskProductWhereCategory(Action):
    
    def name(self) -> Text:
        return "action_ask_product_where_category"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_where_category")

        return []
    
class AskProductInStock(Action):
    
    def name(self) -> Text:
        return "action_ask_product_instock"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_instock")

        return []
    
class AskProductInStockQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_product_instock_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_instock_quantity")

        return []
    
    
class AskProductRatingQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_product_rating_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_rating_quantity")

        return []
    
class AskProductPurchaseQuantity(Action):
    
    def name(self) -> Text:
        return "action_ask_product_purchase_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_ask_product_purchase_quantity")

        return []
    
class FindProductsByCategory(Action):
    
    def name(self) -> Text:
        return "action_find_products_by_category"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_find_products_by_category")

        return []
    
class FindProductsByPriceRange(Action):
    
    def name(self) -> Text:
        return "action_find_products_by_price_range"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_find_products_by_price_range")

        return []
    
class FindProductsByName(Action):
    
    def name(self) -> Text:
        return "action_find_products_by_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_find_products_by_name")

        return []
    
class FindProductsInCategoryByPrice(Action):
    
    def name(self) -> Text:
        return "action_find_product_in_category_by_price"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_find_product_in_category_by_price")

        return []
    

class SuggestProductLargeArea(Action):
    
    def name(self) -> Text:
        return "action_suggest_product_large_area"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_suggest_product_large_area")

        return []
    
class SuggestProductMediumArea(Action):
    
    def name(self) -> Text:
        return "action_suggest_product_medium_area"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_suggest_product_medium_area")

        return []
    
class SuggestProductSmallArea(Action):
    
    def name(self) -> Text:
        return "action_suggest_product_small_area"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_suggest_product_small_area")

        return []
    
class CheckInstockProduct(Action):
    
    def name(self) -> Text:
        return "action_check_instock_product"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="action_check_instock_product")

        return []