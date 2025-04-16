﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.DTOs
{
    public class BaseActivityDto
    {

        public string Title { get; set; } = "";

        public DateTime Date { get; set; }

        public string Description { get; set; } = "";

        public string Category { get; set; } = "";

        //Location Props

        public string City { get; set; } = "";

        public string Venue { get; set; } = "";

        public double Latitude { get; set; }

        public double Longitude { get; set; }

    }
}
