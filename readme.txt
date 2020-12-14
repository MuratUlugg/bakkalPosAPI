Projede Kullanılan Teknolojiler:
Mongo
Express
Angular
NodeJs 
Redis (İlk sefer db'den çekilen data diğer sefer memory üzerinden alınır)
RabbitMQ (Q mekanizması) Tüm güncellenen data bir kuyruğa alınır 
Microservis - Socket IO (Açık borwserlardaki datanın real time güncellemesi sağlayarak sayfa yenilenmeden veri değişimi sağlayacak)

Temel Yapı: 

SELECT CLİENT > Angular > Node.js Service >> Data varsa redis yoksa uzak sunucudaki mongo db 

UPDATE CLİENT > Angular > Node.js Service >> Data varsa redis yoksa uzak sunucudaki mongo db aynı zamanda RabbitMQ
