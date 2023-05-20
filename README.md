- [x] When registering a product or booking a room, the user ID will be stored in the database to keep track of the product owner or the reserved room.
- [x] When a user logs in, the system will remember the active user ID.

- [x] Press the confirmation button for automatic system activation using QR code scanning.
- [x] What type of payment system is used? Please verify it yourself, and then confirm it, or let the system handle it automatically.

- [x] Bidding and purchasing are allowed.
- [x] Allow a 10-minute timeframe for successful transactions. Implement a frontend timeout countdown of 10 minutes, then call the API to update the item status from 1 (reserved/processing to transfer money) back to 0.
- [x] Required information for a transaction: item ID, seller ID, buyer ID, price, and paid date.
- [x] Retrieve a complete list of transactions involving both buyers and sellers.
- [x] Add a status feature to transactions.
- [x] Provide a summary of all transactions.

- [x] If a transaction is successfully completed, create a transaction.

Room:
- 0: Initial
- 1: Active (processing for auction). When a room is opened, the status in the room table will be updated to 1.
- 100: Closed

Item:
- 0: Initial
- 1: Reserved (processing to transfer money)
- 100: Sold

User:
- 0: Inactive
- 1: Active


-----------------------------------------------------

- [x] เมื่อไปลงทะเบียนสินค้าหรือจองห้อง จะมีการบันทึก user id ลงในฐานข้อมูลเพื่อจดจำว่าใครเป็นเจ้าของสินค้าหรือกำลังจองห้องอะไรอยู่
- [x] เมื่อผู้ใช้เข้าสู่ระบบ ระบบจะจดจำ user id ที่กำลังใช้งานอยู่

- [x] กดยืนยันเพื่อเปิดใช้งานระบบอัตโนมัติโดยใช้การสแกนคิวอาร์โค้ด
- [x] ระบบโอนเงินมีลักษณะอย่างไร? กรุณาตรวจสอบและยืนยันด้วยตนเอง หรือระบบสามารถดำเนินการโดยอัตโนมัติได้

- [x] สามารถเปิดประมูลขายหรือซื้อสินค้าได้
- [x] ใช้เวลา 10 นาทีสำหรับการทำธุรกรรมเรียบร้อยแล้ว // ในส่วนของการนับถอยหลัง 10 นาทีที่เกิดขึ้นที่ส่วนหน้าของผู้ใช้งาน จากนั้นเรียกใช้ API updateItemStatus และเปลี่ยนสถานะจาก 1 (การจอง/การทำธุรกรรมโอนเงิน) เป็น 0 แทน
- [x] ข้อมูลที่จำเป็นสำหรับการทำธุรกรรมได้แก่ item_id, seller_id, buyer_id, price, และ paid_date
- [x] ดึงรายการธุรกรรมทั้งหมด (ผู้ซื้อและผู้ขาย)
- [x] เพิ่มสถานะในการทำธุรกรรม
- [x] สรุปรายการธุรกรรมทั้งหมด

- [x] เมื่อธุรกรรมเสร็จสมบูรณ์ สร้างธุรกรรม

กรรม (POST)

ห้อง (Room):
- 0: เริ่มต้น
- 1: ใช้งาน (กำลังประมูล)
- 100: ปิดการใช้งาน

สินค้า (Item):
- 0: เริ่มต้น
- 1: จอง (กำลังทำการโอนเงิน)
- 100: ขายแล้ว

ผู้ใช้ (User):
- 0: ไม่ใช้งาน
- 1: ใช้งานอยู่