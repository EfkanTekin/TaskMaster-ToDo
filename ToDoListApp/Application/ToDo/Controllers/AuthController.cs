using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ToDoListApp.Application.Auth;
using ToDoListApp.Entities;
using ToDoListApp.Services;

namespace ToDoListApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            JwtTokenService jwtTokenService,
            IEmailService emailService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return BadRequest("Bu kullanıcı adı zaten alınmış!");

            ApplicationUser user = new()
            {
                Email = model.Email,
                UserName = model.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Auth", new { userId = user.Id, token = confirmationToken }, Request.Scheme);


            string welcomeMailBody = $@"
                <div style='font-family:Arial, sans-serif; text-align:center; padding:20px; border:1px solid #ddd; border-radius:10px;'>
                    <h2 style='color:#2c3e50;'>TaskFlow Uygulamasına Hoş Geldiniz!</h2>
                    <p>Merhaba <b>{model.Username}</b>, kaydınız başarıyla oluşturuldu.</p>
                    <p>Hesabınızı aktif etmek ve doğrulama işlemini tamamlamak için aşağıdaki butona tıklayın:</p>
                    <a href='{confirmationLink}' style='background-color:#3498db; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block; margin-top:10px;'>Hesabımı Doğrula</a>
                </div>";

            try
            {
                await _emailService.SendEmailAsync(model.Email, "TaskFlow - Hoş Geldiniz ve E-Posta Doğrulama", welcomeMailBody);
            }
            catch
            {
            }

            return Ok("Kullanıcı kaydı başarılı. Lütfen e-posta adresinize gönderilen doğrulama bağlantısını kontrol edin.");
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                return BadRequest("Geçersiz doğrulama isteği.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
                return Ok("E-posta adresiniz başarıyla doğrulandı!");

            return BadRequest("E-posta doğrulama başarısız oldu.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = _jwtTokenService.GenerateToken(user);
                return Ok(new { Token = token });
            }

            return Unauthorized("Kullanıcı adı veya şifre hatalı!");
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId!);
            if (user == null) return NotFound();

            return Ok(new UserProfileDto
            {
                Username = user.UserName!,
                Email = user.Email!,
                ProfilePicture = user.ProfilePicture
            });
        }


        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId!);
            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(request.Username) && request.Username != user.UserName)
            {
                var existingUser = await _userManager.FindByNameAsync(request.Username);
                if (existingUser != null && existingUser.Id != user.Id)
                {
                    return BadRequest(new { message = "Bu kullanıcı adı zaten başka bir kullanıcı tarafından kullanılıyor." });
                }

                user.UserName = request.Username;
            }

            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                user.Email = request.Email;
            }

            user.ProfilePicture = request.ProfilePicture;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);


            if (!string.IsNullOrEmpty(request.NewPassword))
            {
                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);
                if (!passwordResult.Succeeded) return BadRequest(passwordResult.Errors);
            }

            return Ok(new { message = "Profil başarıyla güncellendi." });
        }
}   }