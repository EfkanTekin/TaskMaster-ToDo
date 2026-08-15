# 📋 TaskMaster - To-Do List Application

Modern yazılım geliştirme pratikleri, CQRS mimarisi ve Repository Pattern kullanılarak geliştirilmiş full-stack görev yönetim uygulaması.

---

## 🛠️ Teknolojik Altyapı

* **Backend:** .NET Core Web API, Entity Framework Core, MSSQL Server
* **Frontend:** Angular, SCSS, HTML5, TypeScript, Angular Material
* **Mimari:** CQRS (Command Query Responsibility Segregation), Repository Pattern
* **Veri Mimarisi:** Benzersiz kimlik yönetimi için Guid (UUID) kullanımı

---

## 🏛️ Mimari Yapı (CQRS & Clean Code)

Uygulama standart MVC yapısı yerine sorumlulukların ayrıştırıldığı CQRS prensibine göre kurgulanmıştır:

* **Command Handlers:**
  * `CreateTodoCommandHandler` - Yeni görev oluşturma
  * `UpdateTodoCommandHandler` - Görev güncelleme ve tamamlama durumu değiştirme
  * `DeleteTodoCommandHandler` - Görev silme
* **Query Handlers:**
  * `GetAllTodosQueryHandler` - Tüm görevleri listeleme
  * `GetTodoByIdQueryHandler` - ID bazlı tekil görev getirme
* **Veri Erişimi:** `IToDoRepository` arayüzü ve Entity Framework Core kullanan `ToDoRepository` somut sınıfı ile yönetilmektedir.
* **Veritabanı Modeli:** Tüm tablolarda `ID` alanları `Guid` (UUID) olarak tanımlanmıştır.

---

## 🗄️ Veritabanı Şeması

Entity Framework Core Code-First yaklaşımı ve Migrations ile oluşturulan `ToDo` tablosu:

```sql
CREATE TABLE ToDo (
    ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsCompleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

🚀 Kurulum ve Çalıştırma Adımları
1. Ön Koşullar
.NET 8.0 SDK

Node.js (LTS sürümü) & npm

Angular CLI (npm install -g @angular/cli)

MSSQL Server / LocalDB

2. Backend Kurulumu (.NET Core API)
Bash
# Backend klasörüne geçin
cd ToDoListApp

# Veritabanı tablolarını EF Migrations ile oluşturun
dotnet ef database update

# API'yi başlatın
dotnet run
API ayağa kalktığında https://localhost:7xxx/swagger adresinden Swagger UI arayüzüne erişebilirsiniz.

3. Frontend Kurulumu (Angular)
Bash
# Frontend klasörüne geçin
cd todo-app

# Gerekli npm bağımlılıklarını yükleyin
npm install

# Geliştirme sunucusunu çalıştırın
ng serve
Tarayıcınızdan http://localhost:4200 adresini açarak uygulamayı kullanabilirsiniz.

Örnek İstek Gövdesi (POST /api/todo)
JSON
{
  "title": "Staj Projesi Teslimi",
  "description": "README dokümantasyonu tamamlandı ve teslim edildi.",
  "isCompleted": false
}
