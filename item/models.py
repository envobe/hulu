from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import datetime

from tag.models import *

def attachment_file(instance, filename):
    return os.path.join('file', str(datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')), filename)
    #if len(filename.split('.')) > 1:
    #    return os.path.join('file', str(datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')) + '.' + filename.split('.')[-1])
    #else:
    #    return os.path.join('file', str(datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')))

class UserItemRelationship(models.Model):
    user = models.ForeignKey(User)
    type = models.CharField(max_length=30)

class Item(models.Model):
    user = models.ForeignKey(User)
    status = models.CharField(max_length=30)
    credit = models.BigIntegerField(default=0)
    useritemrelationship = models.ManyToManyField(UserItemRelationship)
    belong = models.ManyToManyField('self', symmetrical=False, blank=True)
    tag = models.ManyToManyField(Tag)

    def get_all_items(self, include_self=True):
        items = []
        if include_self:
            item = self
            itemcontent = item.itemcontent_set.all()
            item.create = itemcontent[0].create
            item.update = itemcontent.reverse().create
            items.append(item)
        #for item in Item.objects.filter(belong=self).prefetch_related('itemcontent_set'):
        for item in self.item_set.prefetch_related('itemcontent_set'):
            itemcontent = item.itemcontent_set.all()
            item.create = itemcontent[0].create
            item.update = itemcontent.reverse().create
            if item not in items:
                items.append(item)
            for subitem in item.get_all_items(include_self=False):
                itemcontent = subitem.itemcontent_set.all()
                subitem.create = itemcontent[0].create
                subitem.update = itemcontent.reverse().create
                if subitem not in items:
                    items.append(subitem)
        return items
    '''def get_all_items(self, items=[], n=0, include_self=True):
        if include_self:
            item = self
            itemcontent = item.itemcontent_set.all()
            item.create = itemcontent[0].create
            item.update = itemcontent.reverse().create
            if item not in items:
                items.append(item)
            return items
        else:
            subitems = []
            for subitem in self.item_set.all():
                subitems.append(subitem)
            if not subitems:
                return items
            else:
                item = subitems[n]
                itemcontent = item.itemcontent_set.all()
                item.create = itemcontent[0].create
                item.update = itemcontent.reverse().create
                if item not in items:
                    items.append(item)
                if n >= len(subitems) - 1:
                    return items
                else:
                    return subitems[n+1].get_all_items(items, include_self=False)'''

    def get_root_items(self):
        rootitems = []
        if self.belong.all():
            for belongitem in self.belong.all().prefetch_related('itemcontent_set'):
                for rootitem in belongitem.get_root_items():
                    if rootitem not in rootitems:
                        rootitems.append(rootitem)
        else:
            rootitems.append(self)
        return rootitems

class ItemContent(models.Model):
    item = models.ForeignKey(Item)
    create = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    ip = models.CharField(max_length=255)
    ua = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

class ContentAttachment(models.Model):
    itemcontent = models.ForeignKey(ItemContent)
    title = models.CharField(max_length=30)
    file = models.FileField(storage=FileSystemStorage(location=settings.MEDIA_ROOT), upload_to=attachment_file)
    content = models.TextField()
    contenttype = models.CharField(max_length=30)
