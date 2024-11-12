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