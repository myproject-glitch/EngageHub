using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class UserAccessor(IHttpContextAccessor httpContextAccessor,
        AppDbContext DbContext) : IUserAccessor
    {

        public async Task<User> GetUserAsync()
        {
            return await DbContext.Users.FindAsync(GetUserId())
                 ?? throw new UnauthorizedAccessException("No user is logged in");
        }


        public string GetUserId()
        {
            return httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new Exception("Mo user found");
        }

        async Task<User> IUserAccessor.GetUserWithPhotosAsync()
        {
            var userId = GetUserId();

            return await DbContext.Users
                .Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.Id == userId)
                 ?? throw new UnauthorizedAccessException("No user is logged in");
        }
    }
}
