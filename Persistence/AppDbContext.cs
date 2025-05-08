﻿using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class AppDbContext(DbContextOptions options) :  IdentityDbContext<User>(options)  
    {
        public required DbSet<Activity> Activities { get; set; }
        public required DbSet<ActivityAttendee> activityAttendees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.ActivityId, a.UserId }));
            builder.Entity<ActivityAttendee>()
                .HasOne(x => x.User)
                .WithMany(x => x.Activities)
                .HasForeignKey(x => x.UserId);


            builder.Entity<ActivityAttendee>()
                 .HasOne(x => x.User)
                 .WithMany(x => x.Activities)
                 .HasForeignKey(x => x.UserId);
        }
    }
}
